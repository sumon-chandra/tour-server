import { Router } from "express";
import { TourControllers } from "./tour.controller";
import { checkAuth } from "../../middlewares/check-auth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validated-request";
import { createTourTypeZodSchema } from "./tour.validation";

export const TourRouter = Router()

TourRouter.post("/create-tour-type", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createTourTypeZodSchema), TourControllers.createTourType)
TourRouter.get("/tour-types", TourControllers.getAllTourTypes)
TourRouter.patch("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourControllers.updateTourType)
TourRouter.get("/tour-types/:id", TourControllers.getTourTypeById)