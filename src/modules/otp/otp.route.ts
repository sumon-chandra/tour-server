import { Router } from "express";
import { OTPControllers } from "./otp.controller";

export const OTPRouter = Router();

OTPRouter.post("/send", OTPControllers.sendOTP);
OTPRouter.post("/verify", OTPControllers.verifyOTP);
