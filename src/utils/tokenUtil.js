import crypto from 'crypto'
import jwt from 'jsonwebtoken';
import config from '../config/serverConfig.js'

const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXP, JWT_REFRESH_EXP} = config

export function generateJti() {
    return crypto.randomBytes(10).toString("hex")
}

export function signAccessToken(payload) {
    return jwt.sign(payload, JWT_ACCESS_SECRET, {expiresIn: JWT_ACCESS_EXP});
}

export function signRefreshToken(payload) {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: JWT_REFRESH_EXP})
}

export function refreshExpiresAt() {
    const decoded = jwt.decode(signRefreshToken({tem: true}), {complete: true})

    const days = parseInt(JWT_REFRESH_EXP ?. replace("d", "") || "30", 10);
    return Date.now() + days * 24 * 60 * 60 * 1000; 
}