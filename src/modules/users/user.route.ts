import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";


export const userRoute = Router();

userRoute.get('/',auth('admin'), userController.getAllUsers);
userRoute.post('/signup', userController.createUser);
userRoute.post('/signin', userController.loginUser);


export default userRoute;