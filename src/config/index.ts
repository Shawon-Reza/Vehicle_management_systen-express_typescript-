import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    PG_connnection_string: process.env.PG_CONNECTION_STRING || '',
    jwt_secret: process.env.JWT_SECRET || 'default_secret'
};

