import AppError from "./appError.js";

class OtpExpiredOrMissing extends AppError {
    constructor(resource) {
        super(`OTP`,400)
    }
}

export default OtpExpiredOrMissing