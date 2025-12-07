
import { Pool } from 'pg';
import { config } from './index';

export const pool = new Pool({
    connectionString: config.PG_connnection_string,
    ssl: {
        rejectUnauthorized: false
    }

});

export const initDb = async () => {

    // Create Users Table
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name Varchar (20) NOT NULL,
            email Varchar (50) NOT NULL UNIQUE CHECK (email = LOWER(email) AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$'),

            phone VARCHAR (15) NOT NULL UNIQUE,
            password VARCHAR (100) NOT NULL CHECK (LENGTH(password) >= 6),
            role VARCHAR (20) CHECK (LOWER(role) IN ('admin', 'customer')) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
    `);
        console.log("User table initialized")

    } catch (err) {
        console.error('Error initializing user table on database', err);
    }

    // Create Vehicles Table
    try {
        await pool.query(`

            CREATE TABLE IF NOT EXISTS vehicles (
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR (50) NOT NULL,
            type VARCHAR (20) NOT NULL CHECK (LOWER(type) IN ('car', 'bike', 'van', 'suv')),
            registration_number VARCHAR (15) NOT NULL UNIQUE,
            daily_rent_price NUMERIC (10, 2) NOT NULL CHECK (daily_rent_price >= 0),
            availability_status VARCHAR(10) CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log("Vehicle table initialized")
    } catch (err) {
        console.error('Error initializing Vehicle table on database', err);
    }

    // Create Bookings Table
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL CHECK (rent_end_date >= rent_start_date),
            total_price NUMERIC (10, 2) NOT NULL CHECK (total_price >= 0),
            status VARCHAR (20) CHECK (LOWER(status) IN ('active', 'cancelled', 'returned')) NOT NULL ,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )`);
        console.log("Booking table initialized")

    } catch (err) {
        console.error('Error initializing Booking table on database', err);
    }


}