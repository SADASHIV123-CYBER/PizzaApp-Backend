// src/controllers/authController.js
import { StatusCodes } from "http-status-codes";
import serverConfig from "../config/serverConfig.js";
import { loginUser } from "../service/authService.js";
import { errorResponce, successResponce } from "../utils/responses.js";
import logger from "../utils/logger.js";

export async function login(req, res) {
  try {
    const loginPayload = req.body;
    console.log('user body', loginPayload);
    
    const token = await loginUser(loginPayload);
    const isProd = serverConfig.NODE_ENV;



const cookieOptions = {
  httpOnly: true,
  secure: isProd,              // ✅ true in production
  sameSite: isProd ? 'None' : 'Lax', // ✅ None for cross-origin
  maxAge: 24 * 60 * 60 * 1000,
  path: '/',
};



    if (process.env.COOKIE_DOMAIN && process.env.COOKIE_DOMAIN !== 'localhost') {
      cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }

    logger.info('Setting auth cookie with options:', cookieOptions);

    res.cookie('authToken', token, cookieOptions);

    return successResponce(res, null, StatusCodes.OK, `User logged in successfully: ${loginPayload.email}`);
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
}
