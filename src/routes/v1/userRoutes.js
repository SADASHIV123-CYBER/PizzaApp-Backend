import express from "express";
import { createUserController, resendOtpController, verifyOtpController } from "../../controller/userController.js";

const userRouter = express.Router();

userRouter.post("/register", createUserController);
userRouter.post("/verify-otp", verifyOtpController);
userRouter.post("/resend-otp", resendOtpController);

export default userRouter;
