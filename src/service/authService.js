// src/service/authService.js
import { findUser } from "../repository/userRepository.js";
import BadRequestError from "../utils/errors/badRequestError.js";
import InternalServerError from "../utils/errors/internalServerError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import serverConfig from "../config/serverConfig.js";
import logger from "../utils/logger.js";


export async function loginUser(authDetails) {
  try {
    const { email, password: plainPassword } = authDetails || {};

    if (!email || !plainPassword) {
      throw new BadRequestError("Email and password are required");
    }

    if (!serverConfig.JWT_SECRET) {
      logger.error("JWT secret is missing from configuration");
      throw new InternalServerError("Authentication configuration error");
    }

    const user = await findUser({ email });
    if (!user) {
      throw new BadRequestError("Invalid email or password");
    }

    console.log("user:", user);
    

    const isPasswordValid = await bcrypt.compare(plainPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError("Invalid email or password");
    }

    console.log(plainPassword, '<--- plain pass');
    console.log(user.password, '<--- hashed pass');
    

    const userRole = user.role || "USER";

    const token = jwt.sign(
      { email: user.email, id: user.id, role: userRole },
      serverConfig.JWT_SECRET,
      { expiresIn: serverConfig.JWT_EXPIRY }
    );

    logger.info(`User logged in successfully: ${email}`);
    return token;
  } catch (error) {

    if (
      error instanceof BadRequestError ||
      (error && typeof error.statusCode === "number" && error.statusCode >= 400 && error.statusCode < 500) ||
      error.name === "BadRequestError"
    ) {
      throw error;
    }

    logger.error("Login process failed (server error)", {
      email: authDetails?.email,
      message: error?.message,
      stack: error?.stack,
    });
    throw new InternalServerError("Unable to process login request");
  }
}
