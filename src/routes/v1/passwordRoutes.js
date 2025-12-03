import express from "express";
import { requestOtp, resetPassword, verifyOtp } from "../../controller/passwordController.js";

const router = express.Router();

router.post('/forgot-password', requestOtp);
router.post('/verify-reset-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;