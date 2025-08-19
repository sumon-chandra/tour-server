import { Router } from "express";
import { UserRoutes } from "../modules/user/users.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { TourRouter } from "../modules/tour/tour.route";
import { DivisionRouter } from "../modules/division/division.route";
import { BookingRouter } from "../modules/booking/booking.route";
import { PaymentRouter } from "../modules/payment/payment.route";

export const router = Router();

const modulesRouters = [
	{
		path: "/users",
		route: UserRoutes,
	},
	{
		path: "/auth",
		route: AuthRouter,
	},
	{
		path: "/tour",
		route: TourRouter,
	},
	{
		path: "/divisions",
		route: DivisionRouter,
	},
	{
		path: "/booking",
		route: BookingRouter,
	},
	{
		path: "/payment",
		route: PaymentRouter,
	},
];

modulesRouters.forEach((route) => {
	router.use(route.path, route.route);
});
