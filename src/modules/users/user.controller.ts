import e, { Request, Response } from "express";
import { userService } from "./user.service";
import  {auth}  from "../../middleware/auth";

// Create User Controller
const createUser = async (req: Request, res: Response) => {
    try {

        const result = await userService.createUser(req.body);
        res.status(201).json(
            {
                success: true,
                message: 'User created successfully',
                data: result.rows[0]
            }
        );

    } catch (err: any) {
        // console.log(err)
        res.status(500).json(
            {
                success: false,
                message: 'Internal Server Error',
                error: err
            }
        );
    }
};

// Login User Controller
const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.loginUser(req.body);
        res.status(200).json(
            {
                success: true,
                message: 'User logged in successfully',
                data: result.user,
                token: result.token
            }
        );
    } catch (err: any) {
        console.log(err.message)
        if (err.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        if (err.message === 'Invalid password') {
            console.log('enters')
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        res.status(500).json(
            {
                success: false,
                message: 'Internal Server Error',
                error: err
            }
        );

    }
};
// Get all Users Controller
const getAllUsers = async( req: Request,  res: Response) => {
    try {
        const result = await userService.getAllUsers();
        res.status(200).json(
            {
                success: true,
                message: 'User logged in successfully',
                data: result.rows,
            }
        );
    } catch (err: any) {
        console.log(err.message)
        if (err.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        if (err.message === 'Invalid password') {
            console.log('enters')
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        res.status(500).json(
            {
                success: false,
                message: 'Internal Server Error',
                error: err
            }
        );

    }
};





export const userController = {
    createUser,
    loginUser,
    getAllUsers
}