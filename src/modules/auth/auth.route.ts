import { Router } from "express";
import { authController } from "./auth.controller";

export const authRoute = Router();

authRoute.post('/signup', authController.createUser);
authRoute.post('/signin', authController.loginUser);