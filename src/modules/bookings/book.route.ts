import { Router } from "express";
import { bookController } from "./book.controller";
import { auth } from "../../middleware/auth";

export const bookRoute = Router();

bookRoute.post("/", auth("admin", "customer"), bookController.createBook);
bookRoute.get("/", auth("admin", "customer"), bookController.getAllBookings);       
bookRoute.put("/:id", auth("admin", "customer"), bookController.UpdateBookingByID);       


