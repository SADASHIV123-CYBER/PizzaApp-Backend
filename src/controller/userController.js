import { registerUser, verifyOtp } from "../service/userService.js";

export const createUserController = async (req, res) => {
  try {
    const response = await registerUser(req.body);
    res.status(201).json({ success: true, ...response });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await verifyOtp(email, otp);
    res.json({ success: true, message: "Email verified", user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
