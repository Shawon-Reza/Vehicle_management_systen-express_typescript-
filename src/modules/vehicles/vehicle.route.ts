import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import { auth } from "../../middleware/auth";


export const vehicleRoute = Router()


vehicleRoute.post("/", auth("admin"), vehicleController.createVehicle)
vehicleRoute.get("/", auth("admin", "customer"), vehicleController.getAllVehicles)
// By ID:------------
vehicleRoute.get("/:id", auth("admin", "customer"), vehicleController.getVehicleByID)
vehicleRoute.put("/:id", auth("admin"), vehicleController.updateVehicleByID)
vehicleRoute.delete("/:id", auth("admin"), vehicleController.deleteVehicleByID)
