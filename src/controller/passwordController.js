import { StatusCodes } from "http-status-codes";
import { passwordService } from "../service/passwordService.js"
import { errorResponce, successResponce } from "../utils/responses.js";

export const requestOtp = async (req, res, next) => {
    try {
        const response = await passwordService.requestOpt(req.body.email);
        return successResponce(res, response, StatusCodes.OK, "OTP sended successfully")
    } catch (error) {
        next(error)   
        return errorResponce(res, error);
    }
}

export const verifyOtp = async(req, res, next) => {
    try {
        const response = await passwordService.verifyOtp(req.body.email, req.body.otp);
        return successResponce(res, response, StatusCodes.OK, "OTP verification successfully done for password reseting")
    } catch (error) {
        next(error)   
        return errorResponce(res, error);
    }
}

export const resetPassword = async(req, res, next) => {
    try {
        const {email, newPassword} = req.body
        const response = await passwordService.resetPassword(email, newPassword);
        return successResponce(res, response, StatusCodes.OK, "Password reseted successfully")
    } catch (error) {
        next(error)   
        return errorResponce(res, error);
    }
}