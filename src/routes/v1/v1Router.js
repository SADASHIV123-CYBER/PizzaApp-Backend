import express from "express";
import userRouter from "./userRoutes.js";
import authRouter from "./auth.js";
import passwordRouter from "./passwordRoutes.js"

const router = express.Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/reset', passwordRouter)

export default router