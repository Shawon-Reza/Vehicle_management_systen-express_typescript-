import { Request, Response } from "express"
import { bookService } from "./book.service"

// Create a booking
const createBook = async (req: Request, res: Response) => {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Please provide data first, then try!"
        });
    }

    try {
        const result = await bookService.createBook(req.body)

        if (!result) {
            return res.status(400).json({
                success: false,
                message: "Booking could not be created"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking created",
            data: result
        })
    } catch (error: any) {
        if (error.message === "Vehicle not found") {
            return res.status(400).json({
                success: false,
                message: "Vehicle not available"
            });
        }
        if (error.message === "User not found") {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        if (error.message === "You already have an active booking for this vehicle") {
            return res.status(400).json({
                success: false,
                message: "You already have an active booking for this vehicle"
            });
        }
        if (error.message === "This vehicle is already booked during the requested dates") {
            return res.status(400).json({
                success: false,
                message: "This vehicle is already booked during the requested dates"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        })
    }
}

// Get all bookings
const getAllBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookService.getAllBookings()
        return res.status(200).json({
            success: true,
            message: "Fetched all bookings successfully",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        })
    }
}

// Update booking by ID
const UpdateBookingByID = async (req: Request, res: Response) => {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    const bookingId = req.params.id;
    const updateData = req.body;
    console.log(updateData)
    console.log("controller trigger")

    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({
            success: false,
            message: "Please provide data to update"
        });
    }

    try {
        const result = await bookService.UpdateBookingByID(bookingId, updateData);

        return res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            data: result
        });
    } catch (error: any) {
        if (error.message === "Booking not found") {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
        if (error.message === "Status field is required") {
            return res.status(400).json({
                success: false,
                message: "Status field is required"
            });
        }
        if (error.message === "Invalid status. Must be 'active', 'cancelled', or 'returned'") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
}


export const bookController = {
    createBook,
    getAllBookings,
    UpdateBookingByID
}