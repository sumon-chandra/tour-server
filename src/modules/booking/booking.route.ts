import { Router } from "express";
import { BookingControllers } from "./booking.controller";
import { checkAuth } from "../../middlewares/check-auth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validated-request";
import { createBookingZodSchema, updateBookingStatusZodSchema } from "./booking.validation";

export const BookingRouter = Router();

BookingRouter.post(
	"/",
	checkAuth(...Object.values(Role)),
	validateRequest(createBookingZodSchema),
	BookingControllers.createBooking
);
BookingRouter.get("/my-bookings", checkAuth(...Object.values(Role)), BookingControllers.getMyBookings);
BookingRouter.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), BookingControllers.getAllBookings);
BookingRouter.get("/:bookingId", checkAuth(...Object.values(Role)), BookingControllers.getBookingById);
BookingRouter.patch(
	"/:bookingId/status",
	checkAuth(...Object.values(Role)),
	validateRequest(updateBookingStatusZodSchema),
	BookingControllers.updateBookingStatus
);
