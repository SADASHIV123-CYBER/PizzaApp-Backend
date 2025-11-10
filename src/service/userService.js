// import { createTempUser, findTempUser, deleteTempUser } from "../repository/tempUserRepository.js";
import generateOtp from "../utils/generateOtp.js";
import emailTemplate from "../utils/emailTemplates.js";
import emailTransporter from "../config/emailConfig.js";
import config from "../config/serverConfig.js";
import { createTempUser, deleteTempUser, findTempUser } from "../repository/tempUserRepository.js";
import { withErrorHandling } from "../utils/errors/errorHandler.js";
import User from "../schema/userSchema.js";
import { createUser, findUser } from "../repository/userRepository.js";

const { EMAIL_USER } = config;

export const registerUser = withErrorHandling( async (data) => {

  // const existingUser = await findUser({ email: data.email });
  // if (existingUser) {
  //   throw new Error("User already registered and verified");
  // }

  const existingTemp = await findTempUser({ email: data.email });
  if (existingTemp) {
    throw new Error("OTP already sent! Please verify your email.");
  }

  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 min

  const tempUser = await createTempUser({
    ...data,
    otp,
    otpExpires: otpExpiry,
    isVerified: false,
  });

  // Send OTP email
  await emailTransporter.sendMail({
    from: `"Auth System" <${EMAIL_USER}>`,
    to: tempUser.email,
    subject: "Email Verification",
    html: emailTemplate({
      name: tempUser.fullName,
      heading: "Verify Your Email",
      message: "Use this OTP to verify your account.",
      otp,
      footer: "This OTP expires in 2 minutes.",
    }),
  });

  return { message: "OTP sent to your email", email: tempUser.email };
});

export const verifyOtp = withErrorHandling( async (email, otp) => {
  const tempUser = await findTempUser({ email });
  if (!tempUser) throw new Error("No OTP request found for this email");

  if (tempUser.otp !== otp || tempUser.otpExpires < Date.now()) {
    throw new Error("Invalid or expired OTP");
  }

  const realUser = await createUser({
    fullName: tempUser.fullName,
    userName: tempUser.userName,
    email: tempUser.email,
    password: tempUser.password,
    profilePicture: tempUser.profilePicture,
    role: tempUser.role,
    mobileNumber: tempUser.mobileNumber,
    displayName: tempUser.displayName,
    isVerified: true,
  });

  await deleteTempUser(tempUser._id);

  return {
    message: "Email verified & Account created successfully",
    user: realUser,
  };
});

export const resendOtp = async (email) => {
  const existingTemp = await findTempUser({ email });
  if (!existingTemp) throw new Error("No OTP found for this email. Please register again.");

  // Check if OTP already valid
  if (existingTemp.otpExpires > Date.now()) {
    throw new Error("OTP still valid, please check your email.");
  }

  // Delete old OTP and create new one
  await deleteTempUser(existingTemp._id);

  const newOtp = generateOtp();
  const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 min

  const tempUser = await createTempUser({
    ...existingTemp.toObject(),
    otp: newOtp,
    otpExpires: otpExpiry,
    isVerified: false,
  });

  await emailTransporter.sendMail({
    from: `"Auth System" <${EMAIL_USER}>`,
    to: tempUser.email,
    subject: "New OTP for Email Verification",
    html: emailTemplate({
      name: tempUser.fullName,
      heading: "Resend OTP",
      message: "Use this new OTP to verify your email.",
      otp: newOtp,
      footer: "This OTP expires in 2 minutes.",
    }),
  });

  return { message: "New OTP sent successfully" };
};
