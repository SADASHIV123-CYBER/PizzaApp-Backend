import express from "express";
import { createUserController, verifyOtpController } from "../../controller/userController.js";

const router = express.Router();

router.post("/register", createUserController);
router.post("/verify-otp", verifyOtpController);

export default router;
