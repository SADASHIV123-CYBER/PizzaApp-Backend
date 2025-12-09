import User from "../schema/userSchema.js"

export const passwordRepository = {
    findByEmail: async (email) => {
        return await User.findOne({email})
    },

    saveOtp: async(userId, otpHash, expiry) => {
        return await User.findByIdAndUpdate(
            userId,
            {
                otpHash,
                otpExpiresAt: expiry,
                otpAttempts: 0, 
                isOtpVerified: false,
                otpUsed: false,
                otpSentAt: Date.now()
            },

            {new: true}
        )
    },

    incrementOtpAttempts: async(userId) => {
        return await User.findByIdAndUpdate(
            userId, 
            {$inc: {otpAttempts: 1}},
            {new: true}
        )
    },

    clearOtp: async (userId) => {
        return await User.findByIdAndUpdate(
            userId,
            {
                otpHash: null,
                otpExpiresAt: null, 
                otpAttempts: 0
            },
            {new: true}
        )
    },

    markOtpVerifyed: async(userId) => {
        return await User.findByIdAndUpdate(userId, {
            // otpUsed: true,
            isOtpVerified: true,
            // otpHash: null,
            // otpExpiresAt: null,
            // otpAttempts: 0
        }, 
        {new: true}
    )
    },

    markOtpUsed: async(userId) => {
        return await User.findByIdAndUpdate(userId, {
            otpUsed: true,
            isOtpVerified: false, 
            otpHash: null, 
            otpExpiresAt: null, 
            otpAttempts: 0
        }, 
        {new: true}
    )
    },

    clearOtpVerification: async(userId) => {
        return await User.findByIdAndUpdate(userId, {isOtpVerified: false})
    },

    updatePassword: async(email, newHashedPassword) => {
        return await User.findOneAndUpdate(
            {email},
            {password: newHashedPassword},
            {new: true}
        )
    },

}

