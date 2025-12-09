import dotenv from 'dotenv'

dotenv.config();

export default {
     PORT : process.env.PORT,
     DB_URL: process.env.DB_URL,
     JWT_SECRET: process.env.JWT_SECRET,
     JWT_EXPIRY: process.env.JWT_EXPIRY,
     CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
     CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
     CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
     EMAIL_USER: process.env.EMAIL_USER,
     EMAIL_PASS: process.env.EMAIL_PASS,
     NODE_ENV: process.env.NODE_ENV,
     JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
     JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
     JWT_ACCESS_EXP: process.env.JWT_ACCESS_EXP,
     JWT_REFRESH_EXP: process.env.JWT_REFRESH_EXP,
     BCRYPT_SALT: process.env.BCRYPT_SALT,
     COOKIE_DOMAIN: process.env.COOKIE_DOMAIN
}