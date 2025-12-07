import { Router } from "express";
import { vehicleController } from "./vehicle.controller";


export const vehicleRoute = Router()


vehicleRoute.post("/",vehicleController.createVehicle)
vehicleRoute.get("/",vehicleController.getAllVehicles)

vehicleRoute.get("/:id",vehicleController.getVehicleByID)
