import { Router } from "express";
import { TourControllers } from "./tour.controller";
import { checkAuth } from "../../middlewares/check-auth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validated-request";
import { createTourTypeZodSchema, createTourZodSchema, updateTourZodSchema } from "./tour.validation";

export const TourRouter = Router();

// Tour Types
TourRouter.post(
	"/create-tour-type",
	checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
	validateRequest(createTourTypeZodSchema),
	TourControllers.createTourType
);
TourRouter.get("/tour-types", TourControllers.getAllTourTypes);
TourRouter.patch("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourControllers.updateTourType);
TourRouter.get("/tour-types/:id", TourControllers.getTourTypeById);

// Tour
TourRouter.post(
	"/create",
	checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
	validateRequest(createTourZodSchema),
	TourControllers.createTour
);
TourRouter.get("/", TourControllers.getAllTour);
TourRouter.get("/:id", TourControllers.getTourById);
TourRouter.patch(
	"/:id",
	checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
	validateRequest(updateTourZodSchema),
	TourControllers.updateTour
);
TourRouter.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourControllers.deleteTour);
