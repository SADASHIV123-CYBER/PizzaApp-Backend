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
     NODE_ENV: process.env.NODE_ENV 

}