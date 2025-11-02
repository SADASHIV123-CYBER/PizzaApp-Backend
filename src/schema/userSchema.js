import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: true,
  },

  userName: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"],
    required: true,
  },

  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters"],
    required: true,
  },

  profilePicture: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
  },

  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  mobileNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    match: [/^[6-9]\d{9}$/, "Please provide a valid 10-digit Indian mobile number"],
  },

  displayName: {
    type: String,
    default: function () {
      return `${this.fullName} (@${this.userName})`;
    },
  },

//   otp: {
//     type: String,
//     required: false, 
//   },

  otpHash: { type: String, select: false },
  otpExpiresAt: { type: Date },
  otpSentAt: { type: Date },     // used for resend-rate limiting
  otpAttempts: { type: Number, default: 0 },

}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

export const User = mongoose.model("User", userSchema);
