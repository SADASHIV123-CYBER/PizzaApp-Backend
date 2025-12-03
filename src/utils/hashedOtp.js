import crypto, { hash } from 'crypto';

function hashedOtp(otp) {
    return crypto.createHash("sha256").update(otp).digest("hex");
}

export default hashedOtp;