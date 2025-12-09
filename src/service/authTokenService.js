import { config } from "../config/serverConfig.js"
import authRepository from "../repository/authRepository.js";
import NotFoundError from "../utils/errors/notFoundError.js";
import { generateJti, signAccessToken, signRefreshToken } from "../utils/tokenUtil.js";

const {JWT_REFRESH_EXP} = config

const REFRESH_EXPIRES_MS = (() => {
    const days = parseInt(JWT_REFRESH_EXP?.replace("d", "") || "30", 10)

    return days * 24 * 60 * 60 * 1000;
})(); 


export const authTokenService = {
    createTokensForUser: async (user, deviceInfo = null) => {
        const accessPayload = {id: user._id, email: user.email, role: user.role}
        const accessToken = signAccessToken(accessPayload);

        const jti = generateJti();
        const refreshPayload = {id: user._id, jti}
        const refreshToken = signRefreshToken(refreshPayload)

        const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS);

        const tokenObj = {
            jti, 
            token: refreshToken,
            createdAt: new Date(),
            deviceInfo, 
            revoked: false, 
            replacedBy: null
        }

        await authRepository.addRefreshToken(user._id, tokenObj);
        return {accessToken, refreshToken, expiresAt, jti}
    },

    rotateRefreshToken: async(oldRefreshToken, deviceInfo = null) => {
        let payload; 
        try {
            payload = verifyRefreshToken(oldRefreshToken)
        } catch (error) {
            throw new Error("Invalid refresh token")
        }

        const {id: userId, jti} = payload;

        const tokenEntry = await authRepository.findTokenEntry(userId, jti);

        if(!tokenEntry) {
            throw new Error("Refresh token not found (db)")
        }

        if(tokenEntry.revoked) {
            throw new Error("Refresh token revoked");
        }

        const user = await authRepository.findUserById(userId);

        if(!user) {
            throw new NotFoundError("user")
        }

        const accessPayload = {id: user._id, email: user.email, role: user.role};
        const accessToken = signAccessToken(accessPayload);

        const newJti = generateJti();
        const newRefreshPayload = {id: user._id, jti: newJti}
        const newRefreshToken = signRefreshToken(newRefreshPayload);
        const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS);

        await authRepository.addRefreshToken(user._id), {
            jti: newJti,
            token: newRefreshToken,
            createdAt: Date.now(),
            expiresAt, 
            deviceInfo,
            revoked: false,
            replacedBy: null
        }

        await authRepository.revokeToken(user._id, jti, newJti);

        return {accessToken, refreshToken: newRefreshToken, expiresAt, jti: newJti};

    },


    revokeRefreshToken: async(userId, jti) => {
        await authRepository.revokeToken(userId, jti, null)
    },

    logout: async(userId, jti) => {
        await authRepository.revokeToken(userId, jti, null)
    }


}