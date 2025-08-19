import httpStatusCode from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { PaymentServices } from "./payment.service";
import { sendResponse } from "../../utils/send-response";

const initializePayment = catchAsync(async (req: Request, res: Response) => {
	const paymentId = req.params.paymentId;
	const payload = req.body;
	const newTour = await PaymentServices.initializePayment(paymentId, payload);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.CREATED,
		message: "Payment initialized!",
		data: newTour,
	});
});

const verifyPayment = catchAsync(async (req: Request, res: Response) => {
	const newTour = await PaymentServices.verifyPayment();

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "Payment Verified Successfully!",
		data: newTour,
	});
});

const paymentStats = catchAsync(async (req: Request, res: Response) => {
	const newTour = await PaymentServices.paymentStats();

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "Payment Stats Retrieved Successfully!",
		data: newTour,
	});
});

export const PaymentControllers = {
	initializePayment,
	verifyPayment,
	paymentStats,
};
