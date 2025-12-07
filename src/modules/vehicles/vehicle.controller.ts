import { Request, Response } from "express"
import { vehicleService } from "./vehicle.service"


const createVehicle = async (req: Request, res: Response) => {

    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Please provide data first, then try!"
        })
    }
    try {
        const result = await vehicleService.createVehicle(req.body)
        res.status(200).json({
            success: true,
            message: "Vehicle created",
            data: result
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        })
    }

}
//  Get cehicle by id 
const getVehicleByID = async (req: Request, res: Response) => {

    try {
        const result = await vehicleService.getVehicleByID(req.params.id)
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "No User Found!",

            })
        }

        return res.status(200).json({
            success: true,
            message: "Fetched vehicle Successfull",
            data: result
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }

}
// Get all vehicles list 
const getAllVehicles = async (req: Request, res: Response) => {

    try {
        const result = await vehicleService.getAllVehicles()
        console.log("Receieved :", result)
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "No data found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Fetched all Vehicles list",
            data: result

        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal serval error",
            error: error
        })
    }
}
// Delete  vehicles by ID 
const deleteVehicleByID = async (req: Request, res: Response) => {

    try {
        const result = await vehicleService.deleteVehicleByID(req.params.id)
        console.log("Receieved Controller :", result)

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "No data found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Deleted Vehicle successfully",
            data: result

        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal serval error",
            error: error
        })
    }
}
// Update vehicle by ID 
const updateVehicleByID = async (req: Request, res: Response) => {
    if (!req.body) {
        return res.status(404).json({
            success: false,
            message: "No data found",
        })
    }
    try {
        const result = await vehicleService.updateVehicleByID(req.params.id, req.body)
        // console.log("Receieved Controller :", req.body)

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "No data found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Updated Vehicle successfully",
            data: result

        })
    } catch (error: any) {
        if (error.message === "Not Found") {
            return res.status(404).json({
                success: false,
                message: "Vehicles Not Found!",
                error: error
            })
        }
        return res.status(500).json({
            success: false,
            message: "Internal serval error",
            error: error
        })
    }
}

export const vehicleController = {
    createVehicle,
    getVehicleByID,
    getAllVehicles,
    deleteVehicleByID,
    updateVehicleByID
}