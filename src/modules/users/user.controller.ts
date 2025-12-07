import e, { Request, Response } from "express";
import { userService } from "./user.service";
import { auth } from "../../middleware/auth";
import { error } from "console";

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
const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUsers();
        res.status(200).json(
            {
                success: true,
                message: 'Fetched users successfully',
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

// Get User by ID Controller
const getUserById = async (req: Request, res: Response) => {
    console.log(req.params.id)
    console.log(typeof req.params.id)
    console.log("im in getuserby id")
    try {

        const result = await userService.getUserById(Number(req.params.id));

        res.status(200).json(
            {
                success: true,
                message: 'Fetched user successfully',
                data: result
            }
        );
    } catch (err: any) {
        if (err.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        };


        res.status(500).json(
            {
                success: false,
                message: 'Internal Server Error',
                error: err
            }
        );
    }
}

// Update User by ID Controller
const updateUserById = async (req: Request, res: Response) => {

    try {
        const result = await userService.updateUserById(Number(req.params.id), req.body);

        if (result.Updatedresult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        };
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: result.updatedUser
        })
    } catch (err: any) {
        if (err.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        if (err.message === 'No data provided for update') {
            return res.status(400).json({
                success: false,
                message: 'No data provided for update'
            })
        }

        res.status(5000).json({
            success: false,
            message: 'Internal Server Error',
            error: err
        })
    }
}

// Delete User by ID Controller
const deleteUserById = async (req: Request, res: Response) => {

    try {
        const result = await userService.deleteUserById(req.params.id)
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Unsuccessfull! User not found or already deleted"
            })

        }
        res.status(200).json({
            success: true,
            message: "Deleted User Successfully"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}



export const userController = {
    createUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
}