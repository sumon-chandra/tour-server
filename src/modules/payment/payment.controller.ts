import httpStatusCode from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { PaymentServices } from "./payment.service";
import { sendResponse } from "../../utils/send-response";
import { envVars } from "../../config/env";

const initializePayment = catchAsync(async (req: Request, res: Response) => {
	const bookingId = req.params.bookingId;
	const paymentData = await PaymentServices.initializePayment(bookingId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.CREATED,
		message: "Payment initialized!",
		data: paymentData,
	});
});

const successPayment = catchAsync(async (req: Request, res: Response) => {
	const query = req.query;
	const sslPayment = await PaymentServices.successPayment(query as Record<string, string>);

	if (sslPayment.success) {
		res.redirect(`${envVars.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`);
	}
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
	const query = req.query;
	const sslPayment = await PaymentServices.failPayment(query as Record<string, string>);

	if (sslPayment.success) {
		res.redirect(`${envVars.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`);
	}
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
	const query = req.query;
	const sslPayment = await PaymentServices.cancelPayment(query as Record<string, string>);

	if (sslPayment.success) {
		res.redirect(`${envVars.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&amount=${query.amount}&status=${query.status}`);
	}
});

const getPaymentInvoiceUrl = catchAsync(async (req: Request, res: Response) => {
	const { paymentId } = req.params;
	const response = await PaymentServices.getPaymentInvoiceUrl(paymentId);
	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.CREATED,
		message: "Payment initialized!",
		data: response,
	});
});

export const PaymentControllers = {
	initializePayment,
	successPayment,
	failPayment,
	cancelPayment,
	getPaymentInvoiceUrl,
};
