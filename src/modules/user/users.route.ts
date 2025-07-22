import { Router } from "express";
import { userControllers } from "./user.controller";

export const UserRoutes = Router()

UserRoutes.post("/register", userControllers.createUser)
UserRoutes.get("/", userControllers.getAllUsers)