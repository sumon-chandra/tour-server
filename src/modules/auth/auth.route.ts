import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/check-auth";
import { Role } from "../user/user.interface";
import passport from "passport";

export const AuthRouter = Router();

AuthRouter.post("/login", AuthControllers.credentialsLogin);
AuthRouter.post("/refresh-token", AuthControllers.getNewUserAccessToken);
AuthRouter.post("/logout", AuthControllers.logout);
AuthRouter.post("/change-password", checkAuth(...Object.values(Role)), AuthControllers.changePassword);
AuthRouter.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword);
AuthRouter.post("/set-password", checkAuth(...Object.values(Role)), AuthControllers.setPassword);
AuthRouter.get("/google", async (req: Request, res: Response, next: NextFunction) => {
	const redirect = req.query.redirect || "/";
	passport.authenticate("google", {
		scope: ["profile", "email"],
		state: redirect as string,
	})(req, res, next);
});
AuthRouter.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthControllers.googleCallbackController);
