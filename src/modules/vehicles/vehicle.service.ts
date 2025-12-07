
import { pool } from "../../config/db"


const createVehicle = async (userData: Record<string, unknown>) => {
    console.log("User Data: ", userData)

    const result = await pool.query(`
    INSERT INTO vehicles (
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status
    ) VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
       `,
        [
            userData.vehicle_name,
            userData.type,
            userData.registration_number,
            userData.daily_rent_price,
            userData.availability_status || 'available' // default if not provided
        ]);
    const user = result.rows[0]
    return user
}

// Fetch  vehicle by id 
const getVehicleByID = async (id: any) => {
    const result = await pool.query(`
    SELECT * FROM vehicles where id=$1 
    `, [id])
    const vehicle = result.rows[0]
    return vehicle
}
// Get all vehicles list
const getAllVehicles = async () => {
    const result = await pool.query(`
    SELECT * FROM vehicles
    `)
    console.log(result.rows)
    return result.rows
}
// Delete vehicles by ID
const deleteVehicleByID = async (id: any) => {
    const result = await pool.query(`
    DELETE FROM vehicles WHERE id=$1 RETURNING *
    `, [id])

    return result.rows[0]
}

export const vehicleService = {
    createVehicle,
    getVehicleByID,
    getAllVehicles,
    deleteVehicleByID
}