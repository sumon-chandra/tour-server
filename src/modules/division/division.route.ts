import { Router } from "express";
import { checkAuth } from "../../middlewares/check-auth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validated-request";
import { createDivisionZodSchema, updateDivisionZodSchema } from "./division.validation";
import { DivisionControllers } from "./division.controller";

export const DivisionRouter = Router();

DivisionRouter.post(
	"/create",
	checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
	validateRequest(createDivisionZodSchema),
	DivisionControllers.createDivision
);
DivisionRouter.get("/", DivisionControllers.getAllDivision);
DivisionRouter.get("/:slug", DivisionControllers.getSingleDivision);
DivisionRouter.patch(
	"/:id",
	checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
	validateRequest(updateDivisionZodSchema),
	DivisionControllers.updateDivision
);
DivisionRouter.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionControllers.deleteDivision);
