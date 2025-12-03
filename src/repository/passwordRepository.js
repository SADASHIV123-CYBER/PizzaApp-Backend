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

    updatePassword: async(email, newHashedPassword) => {
        return await User.findOneAndUpdate(
            {email},
            {password: newHashedPassword},
            {new: true}
        )
    }
}

