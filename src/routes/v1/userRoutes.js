import express from "express";
import { createUserController, resendOtpController, verifyOtpController } from "../../controller/userController.js";

const router = express.Router();

router.post("/register", createUserController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController);

export default router;
