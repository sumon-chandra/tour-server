import { Router } from "express";
import { checkAuth } from "../../middlewares/check-auth";
import { Role } from "../user/user.interface";
import { StatsControllers } from "./stats.controller";

export const StatsRouter = Router();

StatsRouter.get("/booking", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatsControllers.getBookingStats);
StatsRouter.get("/payment", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatsControllers.getPaymentStats);
StatsRouter.get("/tour", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatsControllers.getTourStats);
StatsRouter.get("/division", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatsControllers.getDivisionStats);
StatsRouter.get("/user", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), StatsControllers.getUserStats);
