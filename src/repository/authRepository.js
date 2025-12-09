import User from "../schema/userSchema.js";

const authRepository = {
    addRefreshToken: async (userId, tokenObj) => {
        return await User.findByIdAndUpdate(
            userId,
            { $push: { refreshTokens: tokenObj } },   
            { new: true }
        );
    },

    findUserById: async (id) => User.findById(id),

    findUserByRefreshJti: async (jti) => {
        return await User.findOne({ "refreshTokens.jti": jti });   
    },

    findTokenEntry: async (userId, jti) => {
        const user = await User.findOne(
            { _id: userId, "refreshTokens.jti": jti }, 
            { "refreshTokens.$": 1 }   
        );
        return user?.refreshTokens?.[0] ?? null;    
    },

    revokeToken: async (userId, jti, replacedBy = null) => {
        return await User.updateOne(
            { _id: userId, "refreshTokens.jti": jti },   
            { $set: { 
                "refreshTokens.$.revoked": true, 
                "refreshTokens.$.replacedBy": replacedBy 
            }}
        );
    },

    removeExpiredToken: async (userId) => {
        const now = new Date();   

        return await User.updateOne(
            { _id: userId },
            { $pull: { refreshTokens: { expiresAt: { $lte: now } } } }   
        );
    },

    revokeAllTokens: async (userId) => {
        return await User.updateOne(
            { _id: userId },
            { $set: { "refreshTokens.$[].revoked": true } }   
        );
    },

    removeRefreshToken: async (userId, jti) => {
        return await User.updateOne(
            { _id: userId },
            { $pull: { refreshTokens: { jti: jti } } }  
        );
    }
};

export default authRepository;
