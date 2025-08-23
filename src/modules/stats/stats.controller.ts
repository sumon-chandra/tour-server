import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { StatsServices } from "./stats.service";
import { sendResponse } from "../../utils/send-response";

const getUserStats = catchAsync(async (req: Request, res: Response) => {
	const userStats = await StatsServices.getUserStats();

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "All User Stats Retrieved Successfully!",
		data: userStats,
	});
});

const getTourStats = catchAsync(async (req: Request, res: Response) => {
	const tourStats = await StatsServices.getTourStats();

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "All Tour Stats Retrieved Successfully!",
		data: tourStats,
	});
});

const getBookingStats = catchAsync(async (req: Request, res: Response) => {
	const bookingStats = await StatsServices.getBookingStats();

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "All Booking Stats Retrieved Successfully!",
		data: bookingStats,
	});
});

const getDivisionStats = catchAsync(async (req: Request, res: Response) => {
	const divisionStats = await StatsServices.getDivisionStats();

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "All Division Stats Retrieved Successfully!",
		data: divisionStats,
	});
});

const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
	const paymentStats = await StatsServices.getPaymentStats();

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "All Payment Stats Retrieved Successfully!",
		data: paymentStats,
	});
});

export const StatsControllers = {
	getBookingStats,
	getPaymentStats,
	getDivisionStats,
	getTourStats,
	getUserStats,
};
