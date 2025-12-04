import emailTransporter from "../config/emailConfig.js";
import { passwordRepository } from "../repository/passwordRepository.js";
import emailTemplate from "../utils/emailTemplates.js";
import InvalidOTP from "../utils/errors/invalidOtp.js";
import NotFoundError from "../utils/errors/notFoundError.js";
import OtpExpiredOrMissing from "../utils/errors/otpExpired.js";
import generateOtp from "../utils/generateOtp.js";
import hashedOtp from "../utils/hashedOtp.js";
import bcrypt from 'bcrypt'

const OTP_EXPIRY = 10 * 60 * 1000;
const RESEND_INTERVAL = 60 * 1000;
const MAX_ATTEMPTS = 5;

export const passwordService = {
    requestOpt: async(email) => {
        const user = await passwordRepository.findByEmail(email);
        if(!user) {
            throw new Error("Email is not registered")
        }

        if(user.otpSentAt && Date.now() - user.otpSentAt < RESEND_INTERVAL) {
            const wait = Math.ceil((RESEND_INTERVAL - (Date.now() - user.otpSentAt)) / 1000);
            throw new Error(`Please wait ${wait}s before requesting new OTP`);
        }

        const otp = generateOtp();
        const otpHash = hashedOtp(otp);
        const expiry = Date.now() + OTP_EXPIRY;

        await passwordRepository.saveOtp(user._id, otpHash, expiry);

        await emailTransporter.sendMail({
            to: user.email, 
            subject: "Password Reset OTP",
            html: emailTemplate({
                name: user.fullName,
                heading: "Reset Your Password", 
                message: "Use the OTP below to continue:",
                otp, 
                footer: "This OTP is valid for 10 minutes"
            })
        })

        return {message: "OTP sent to email"}
    },

    verifyOtp: async(email, otp) => {
        const user = await passwordRepository.findByEmail(email);
        if(!user) {
            throw new NotFoundError("user")
        }

        if(!user.otpHash || !user.otpExpiresAt || user.otpExpiresAt < Date.now()) {
            throw new OtpExpiredOrMissing('expired or missing');
        }

        if(user.otpAttempts >= MAX_ATTEMPTS) {
            throw new Error("Maximum OTP attempts exceeded");
        }

        const incomingHash = hashedOtp(otp);

        if(incomingHash !== user.otpHash) {
            await passwordRepository.incrementOtpAttempts(user._id);
            throw new InvalidOTP();
        }

        await passwordRepository.clearOtp(user._id);

        return {message: "OTP verified"};
    },

    resetPassword: async(email, newPassword) => {
        const user = await passwordRepository.findByEmail(email);
        if(!user) {
            throw new NotFoundError("user")
        }

        if(!user.isOtpVerified) {
            throw new InvalidOTP("OTP not verified. Please verify OTP first.")
        }

        const hashedPass = await bcrypt.hash(newPassword,   10);

        await passwordRepository.updatePassword(email, hashedPass);

        return {message: "Password updated successfully"}
    }
}