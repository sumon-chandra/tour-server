import { Router } from "express";
import { checkAuth } from "../../middlewares/check-auth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validated-request";
import { createDivisionZodSchema, updateDivisionZodSchema } from "./division.validation";
import { DivisionControllers } from "./division.controller";
import { multerUpload } from "../../config/multer.config";

export const DivisionRouter = Router();

DivisionRouter.post(
	"/create",
	checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
	multerUpload.single("file"),
	validateRequest(createDivisionZodSchema),
	DivisionControllers.createDivision
);
DivisionRouter.get("/", DivisionControllers.getAllDivision);
DivisionRouter.get("/:slug", DivisionControllers.getSingleDivision);
DivisionRouter.patch(
	"/:id",
	checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
	multerUpload.single("file"),
	validateRequest(updateDivisionZodSchema),
	DivisionControllers.updateDivision
);
DivisionRouter.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionControllers.deleteDivision);
