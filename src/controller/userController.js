import { StatusCodes } from "http-status-codes";
import { registerUser, resendOtp, verifyOtp } from "../service/userService.js";
import { errorResponce, successResponce } from "../utils/responses.js";

export const createUserController = async (req, res) => {
  try {
    const response = await registerUser(req.body);
    return successResponce(res, response, StatusCodes.CREATED, "User registered successfully")
  } catch (error) {
   return errorResponce(res, error); 
  }


};

export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await verifyOtp(email, otp);
    return successResponce(res, user, StatusCodes.OK, "OTP verified successfully");
  } catch (err) {
    return errorResponce(res, err);
  }
};

export const resendOtpController = async (req, res) => {
  try {
    const response = await resendOtp(req.body.email);
    return successResponce(res, response, StatusCodes.OK, "OTP resent successfully");
  } catch (error) {
    return errorResponce(res, error);
  }
}
