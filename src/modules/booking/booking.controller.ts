import httpStatusCode from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { BookingServices } from "./booking.service";
import { sendResponse } from "../../utils/send-response";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const decodedToken = req.user as JwtPayload;
	const booked = await BookingServices.createBooking(payload, decodedToken.userId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.CREATED,
		message: "The tour has been booked!",
		data: booked,
	});
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
	const myBookings = await BookingServices.getMyBookings();

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "My bookings has been retrieved!",
		data: myBookings,
	});
});

const getBookingById = catchAsync(async (req: Request, res: Response) => {
	const bookingId = req.params.bookingId;
	const myBookings = await BookingServices.getBookingById(bookingId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "The booking details has been retrieved successfully!",
		data: myBookings,
	});
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
	const myBookings = await BookingServices.getAllBookings();

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "All bookings has been retrieved!",
		data: myBookings,
	});
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
	const bookingId = req.params.bookingId;
	const bookingStatus = req.body.status;
	const myBookings = await BookingServices.updateBookingStatus(bookingId, bookingStatus);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "My bookings has been retrieved!",
		data: myBookings,
	});
});

export const BookingControllers = {
	createBooking,
	getMyBookings,
	getBookingById,
	getAllBookings,
	updateBookingStatus,
};
