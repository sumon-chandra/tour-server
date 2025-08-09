import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/check-auth";
import { Role } from "../user/user.interface";

export const AuthRouter = Router()

AuthRouter.post("/login", AuthControllers.credentialsLogin)
AuthRouter.post("/refresh-token", AuthControllers.getNewUserAccessToken)
AuthRouter.post("/logout", AuthControllers.logout)
AuthRouter.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword)