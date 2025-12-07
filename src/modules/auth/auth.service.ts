import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config";

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

export const authService = {
    createUser,
    loginUser,

};