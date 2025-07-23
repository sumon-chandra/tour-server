import { Router } from "express";
import { userControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validated-request";

export const UserRoutes = Router()

UserRoutes.post(
    "/register",
    validateRequest(createUserZodSchema),
    userControllers.createUser
)
UserRoutes.get("/", userControllers.getAllUsers)