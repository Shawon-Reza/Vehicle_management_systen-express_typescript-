import { pool } from "../../config/db";

const createBook = async (bookData: Record<string, any>) => {
    console.log("User Booked Data:", bookData)
    console.log("Vehicles Id:", bookData.vehicle_id)

    // Check vehicle rent price
    const result = await pool.query(
        `SELECT daily_rent_price FROM vehicles WHERE id=$1`,
        [bookData.vehicle_id]
    );

    console.log("Rent Price Result:", result.rows[0])
    const daily_rent = Number(result.rows[0].daily_rent_price);
    console.log(daily_rent)

    // CHECK IF USER EXISTS
    const checkUser = await pool.query(
        `SELECT id FROM users WHERE id=$1`,
        [bookData.customer_id]
    );
    if (checkUser.rowCount === 0) {
        throw new Error("User not found");
    }

    if (result.rowCount === 0) {
        throw new Error("Vehicle not found");
    }

    // CHECK IF BOOKING ALREADY EXISTS FOR THIS CUSTOMER AND VEHICLE
    const existingBooking = await pool.query(
        `SELECT id FROM bookings WHERE customer_id=$1 AND vehicle_id=$2 AND status='active'`,
        [bookData.customer_id, bookData.vehicle_id]
    );
    if (existingBooking.rowCount && existingBooking.rowCount > 0) {
        throw new Error("You already have an active booking for this vehicle");
    }

    // CHECK IF VEHICLE IS ALREADY BOOKED BY ANOTHER CUSTOMER DURING THE REQUESTED DATES
    const conflictingBooking = await pool.query(
        `SELECT id FROM bookings 
         WHERE vehicle_id=$1 
         AND status='active' 
         AND (
            (rent_start_date <= $2 AND rent_end_date >= $2) OR
            (rent_start_date <= $3 AND rent_end_date >= $3) OR
            (rent_start_date >= $2 AND rent_end_date <= $3)
         )`,
        [bookData.vehicle_id, bookData.rent_start_date, bookData.rent_end_date]
    );
    if (conflictingBooking.rowCount && conflictingBooking.rowCount > 0) {
        throw new Error("This vehicle is already booked during the requested dates");
    }

    // Calculate total rent
    const startDate = new Date(bookData.rent_start_date);
    const endDate = new Date(bookData.rent_end_date);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;  // +1 to include both start and end date
    const totalRent = daily_rent * daysDiff;
    console.log("Total Rent:", totalRent)

    // Insert booking record
    const insertResult = await pool.query(
        `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
            bookData.customer_id,
            bookData.vehicle_id,
            bookData.rent_start_date,
            bookData.rent_end_date,
            totalRent,

        ]
    );
    console.log("Booking:", insertResult.rows[0])
    return insertResult.rows[0];
}
// Get all bookings
const getAllBookings = async () => {
    const result = await pool.query(
        `SELECT * FROM bookings ORDER BY created_at DESC`
    );
    return result.rows;
}

// Update booking by ID
const UpdateBookingByID = async (bookingId: any, updateData: Record<string, any>) => {
    console.log("Updated trigger")
    console.log("User booking :", bookingId)
    console.log("User data:", updateData)

    // Check if booking exists
    const bookingCheck = await pool.query(
        `SELECT * FROM bookings WHERE id=$1`,
        [bookingId]
    );

    if (bookingCheck.rowCount === 0) {
        throw new Error("Booking not found");
    }

    // Validate status if provided
    if (!updateData.status) {
        throw new Error("Status field is required");
    }

    const validStatuses = ['active', 'cancelled', 'returned'];
    if (!validStatuses.includes(updateData.status.toLowerCase())) {
        throw new Error("Invalid status. Must be 'active', 'cancelled', or 'returned'");
    }

    // Update the booking
    const result = await pool.query(
        `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
        [updateData.status.toLowerCase(), bookingId]
    );

    return result.rows[0];
}

export const bookService = {
    createBook,
    getAllBookings,
    UpdateBookingByID
}