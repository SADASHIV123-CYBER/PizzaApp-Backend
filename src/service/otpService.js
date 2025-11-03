import crypto from "crypto";
import { repo } from "../repository/userRepository.js";
import { emailService } from "./emailService.js";

const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds between sends
const MAX_RESEND_PER_HOUR = 5;
const MAX_VERIFY_ATTEMPTS = 5;

// Helper: generate numeric OTP as string
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
};

// Helper: hash OTP (store hash, send plain)
const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

export const otpService = {
  sendAndSaveOTP: async (user) => {
    // rate limiting checks
    const now = Date.now();
    if (user.otpSentAt) {
      const lastSent = new Date(user.otpSentAt).getTime();
      if (now - lastSent < RESEND_COOLDOWN_MS) {
        const waitSec = Math.ceil((RESEND_COOLDOWN_MS - (now - lastSent))/1000);
        const err = new Error(`Please wait ${waitSec}s before requesting a new OTP`);
        err.status = 429; throw err;
      }
    }

    // optional: count hourly sends (simple approach)
    // For a more accurate hourly count you'd use a separate collection or Redis.
    // Here we rely on frontend UX + cooldown and max attempts.

    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiry = Date.now() + OTP_TTL_MS;

    await repo.saveOTP(user._id, otpHash, expiry);

    // send email asynchronously (don't block DB) — but await to catch errors
    await emailService.sendOTPEmail({ to: user.email, name: user.fullName, otp, expiresInMinutes: OTP_TTL_MS/60000 });
    return { otpSent: true, otpExpiry: expiry };
  },

  verifyOTP: async (email, plainOtp) => {
    const user = await repo.findByEmail(email, true);
    if (!user) {
      const err = new Error("User not found");
      err.status = 404; throw err;
    }

    // check expiry & presence
    if (!user.otpHash || !user.otpExpiresAt || new Date(user.otpExpiresAt).getTime() < Date.now()) {
      const err = new Error("OTP expired or not found. Request new OTP.");
      err.status = 400; throw err;
    }

    // check attempts
    if (user.otpAttempts >= MAX_VERIFY_ATTEMPTS) {
      const err = new Error("Maximum verification attempts exceeded. Request a new OTP.");
      err.status = 429; throw err;
    }

    // compare hashed
    const incomingHash = hashOTP(plainOtp);
    if (incomingHash !== user.otpHash) {
      await repo.incrementOtpAttempts(user._id);
      const err = new Error("Invalid OTP");
      err.status = 400; throw err;
    }

    // success — mark verified and clear OTP
    const verifiedUser = await repo.verifyUser(user._id);
    return verifiedUser;
  },

  resendOTP: async (email) => {
    const user = await repo.findByEmail(email, true);
    if (!user) { const err = new Error("User not found"); err.status = 404; throw err; }

    // Rate: ensure not too many sends recently
    // Check if they have exceeded simple hourly limit — naive check using otpSentAt & otpAttempts
    const now = Date.now();
    if (user.otpSentAt) {
      const lastSent = new Date(user.otpSentAt).getTime();
      if (now - lastSent < RESEND_COOLDOWN_MS) {
        const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - (now - lastSent))/1000);
        const err = new Error(`Please wait ${waitSeconds}s before resending OTP`);
        err.status = 429; throw err;
      }
    }

    // send new otp
    return otpService.sendAndSaveOTP(user);
  }
};
