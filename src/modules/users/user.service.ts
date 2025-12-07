import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { error } from "console";

const createUser = async (userData: Record<string, any>) => {

    // Hash Password
    const hashpassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashpassword;

    // Insert User into Database
    const result = await pool.query(`
    INSERT INTO users (name, email, phone, password, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `, [userData.name, userData.email, userData.phone, userData.password, userData.role]
    );
    return result;
}
// User Login Service
const loginUser = async (userData: Record<string, any>) => {

    console.log(userData)
    // Insert User into Database
    const result = await pool.query(`
        SELECT * FROM users WHERE email = $1;
    `, [userData.email]
    );

    const user = result.rows[0];
    // console.log(user)

    if (!user) {
        throw new Error('User not found');
    }

    // Password Validation
    const isPasswordValid = await bcrypt.compare(userData.password, user.password);
    // console.log(isPasswordValid)
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        config.jwt_secret || "default_secret",
        { expiresIn: "7d" }
    )

    return {
        user,
        token

    };
}

// All users Service
const getAllUsers = async () => {

    const result = await pool.query(`
        SELECT id, name, email, phone, role, created_at FROM users;
    `);
    return result;
}

// Get User by ID Service
const getUserById = async (userId: number) => {
    const result = await pool.query(`
        SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1;
    `, [userId]);

    const user = result.rows[0];
    if (!user) {
        throw new Error('User not found');
    }

    return user;
}
// Update User by ID Service
const updateUserById = async (userId: number, userData: Record<string, any>) => {
    // console.log("User provided data: ",userData)
    if (!userData) {
        throw new Error('No data provided for update');
    }

    const result = await pool.query(`
        SELECT * FROM users WHERE id = $1;
    `, [userId]);
    const user = result.rows[0];
    if (!user) {
        throw new Error('User not found');
    }

    const updatedUser = {
        ...user,
        ...userData
    };

    // Save updated user to database
    const Updatedresult = await pool.query(`
        UPDATE users
        SET name = $1, email = $2, phone = $3, role = $4
        WHERE id = $5;
    `, [updatedUser.name, updatedUser.email, updatedUser.phone, updatedUser.role, userId]);

    return { Updatedresult, updatedUser };
}

// Delete user by id Service
const deleteUserById = async (id: any) => {
    console.log(id)
    const result = await pool.query(`
        DELETE FROM users WHERE id=$1 RETURNING *; 
        `, [id])
    return result
}
export const userService = {
    createUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById

};