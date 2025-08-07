import { Router } from "express";
import { userControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validated-request";
import { checkAuth } from "../../middlewares/check-auth";
import { Role } from "./user.interface";

export const UserRoutes = Router()

UserRoutes.post("/register", validateRequest(createUserZodSchema), userControllers.createUser)
UserRoutes.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userControllers.getAllUsers)