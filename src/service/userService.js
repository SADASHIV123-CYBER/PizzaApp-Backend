import { createUser, findUser, updateUser } from "../repository/userRepository.js";
import generateOtp from "../utils/generateOtp.js";
import emailTemplate from "../utils/emailTemplates.js";
import emailTransporter from "../config/emailConfig.js";
import config from "../config/serverConfig.js";
const { EMAIL_USER } = config;

export const registerUser = async (data) => {
  const existing = await findUser({ email: data.email });
  if (existing) throw new Error("User already exists!");

  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  const user = await createUser({
    ...data,
    otp,
    otpExpires: otpExpiry
  });

  await emailTransporter.sendMail({
    from: `"Auth System" <${EMAIL_USER}>`,
    to: user.email,
    subject: "Verify your Email",
    html: emailTemplate({
      name: user.fullName,
      heading: "Verify Your Email",
      message: "Please use the provided OTP within the Alchemy Food World website itself to complete your registration.",
      otp: otp,
      footer: "Do not share this OTP with anyone."
    })
  });

  return { message: "OTP sent to email", userId: user._id };
};

export const verifyOtp = async (email, otp) => {
  const user = await findUser({ email });
  if (!user) throw new Error("User not found!");

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    throw new Error("Invalid or expired OTP!");
  }

  return await updateUser(user._id, {
    isVerified: true,
    otp: null,
    otpExpires: null
  });
};
