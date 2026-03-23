import Router from "express"
import {
  register,
  login
} from "../controllers/userController.js";

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post("/register", register)

/**
 * @route POST /api/auth/login
 * @description Logging in
 * @access Public
 */

authRouter.post("/login", login)

export default authRouter