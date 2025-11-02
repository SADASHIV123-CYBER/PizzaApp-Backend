import { User } from "../schema/userSchema.js";

export const repo = {
  createUser: async (userData) => {
    return User.create(userData);
  },

  findByEmail: async (email, withHidden = false) => {
    if (withHidden) return User.findOne({ email }).select("+password +otpHash +otpAttempts");
    return User.findOne({ email });
  },

  findById: async (id) => User.findById(id),

  saveOTP: async (userId, otpHash, expiry) => {
    return User.findByIdAndUpdate(userId, {
      otpHash,
      otpExpiresAt: new Date(expiry),
      otpSentAt: new Date(),
      otpAttempts: 0 // reset attempts on new OTP
    }, { new: true }).select("+otpHash +otpAttempts");
  },

  clearOTP: async (userId) => {
    return User.findByIdAndUpdate(userId, {
      otpHash: undefined,
      otpExpiresAt: undefined,
      otpSentAt: undefined,
      otpAttempts: 0
    }, { new: true });
  },

  incrementOtpAttempts: async (userId) => {
    return User.findByIdAndUpdate(userId, { $inc: { otpAttempts: 1 } }, { new: true }).select("+otpAttempts");
  },

  verifyUser: async (userId) => {
    return User.findByIdAndUpdate(userId, {
      isVerified: true,
      otpHash: undefined,
      otpExpiresAt: undefined,
      otpSentAt: undefined,
      otpAttempts: 0
    }, { new: true });
  }
};
