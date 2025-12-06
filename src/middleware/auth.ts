import { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";


export const auth = (...role: string[]) => {
    console.log(role)

    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];
        console.log(token)
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized: No token provided'
            });
            return;
        }

        try {
            const tokenData = Jwt.verify(token, config.jwt_secret ) as Record<string, any>;
            console.log(tokenData)

            if (role.length && !role.includes(tokenData.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: You do not have access to this resource'
                });
            }

            req.user = tokenData;

        } catch (err) {
            console.log(err)
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid token'
            });
        }


        next();
    };
}