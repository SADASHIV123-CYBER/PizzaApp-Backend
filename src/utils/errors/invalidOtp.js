import AppError from "./appError.js";

class InvalidOTP extends AppError {
    constructor(message = "Invalid OTP") {
        super(message, 401);
    }
}

export default InvalidOTP;
