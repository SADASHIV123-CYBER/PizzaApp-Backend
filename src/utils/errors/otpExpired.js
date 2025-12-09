import AppError from "./appError.js";

class OtpExpiredOrMissing extends AppError {
    constructor(resource) {
        super(`OTP expired or missing`,400)
    }
}

export default OtpExpiredOrMissing