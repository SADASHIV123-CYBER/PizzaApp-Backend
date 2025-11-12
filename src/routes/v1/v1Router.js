import express from "express";
import userRouter from "./userRoutes.js";
import authRouter from "./auth.js";

const router = express.Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);

export default router