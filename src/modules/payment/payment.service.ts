/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../error-helpers/app-error";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { SSLCommerzServices } from "../sslCommerz/sslCommerz.service";

const initializePayment = async (bookingId: string) => {
	const payment = await Payment.findOne({ booking: bookingId });
	if (!payment) {
		throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found");
	}
	const booking = await Booking.findById(payment.booking);
	const sslPayload = {
		address: (booking?.user as any).address,
		email: (booking?.user as any).email,
		phoneNumber: (booking?.user as any).phone,
		name: (booking?.user as any).name,
		transactionId: payment.transactionId,
		amount: payment.amount,
	};
	const sslPayment = await SSLCommerzServices.sslCommerzPaymentInit(sslPayload);

	return {
		paymentUrl: sslPayment.GatewayPageURL,
	};
};

const successPayment = async (query: Record<string, string>) => {
	const session = await Booking.startSession();
	session.startTransaction();

	try {
		const updatedPayment = await Payment.findOneAndUpdate(
			{ transactionId: query.transactionId },
			{ status: PAYMENT_STATUS.PAID },
			{ runValidators: true, session }
		);

		await Booking.findByIdAndUpdate(
			updatedPayment?.booking,
			{ status: BOOKING_STATUS.COMPLETE },
			{ runValidators: true, session }
		);

		await session.commitTransaction();
		session.endSession();

		return { success: true, message: "SSLCommerz Payment Successful." };
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		throw error;
	}
};

const failPayment = async (query: Record<string, string>) => {
	const session = await Booking.startSession();
	session.startTransaction();

	try {
		const updatedPayment = await Payment.findOneAndUpdate(
			{ transactionId: query.transactionId },
			{ status: PAYMENT_STATUS.FAILED },
			{ new: true, runValidators: true, session }
		);

		await Booking.findByIdAndUpdate(
			updatedPayment?.booking,
			{ status: BOOKING_STATUS.FAILED },
			{ new: true, runValidators: true, session }
		);

		await session.commitTransaction();
		session.endSession();

		return { success: true, message: "Payment Failed." };
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		throw error;
	}
};

const cancelPayment = async (query: Record<string, string>) => {
	const session = await Booking.startSession();
	session.startTransaction();

	try {
		const updatedPayment = await Payment.findOneAndUpdate(
			{ transactionId: query.transactionId },
			{ status: PAYMENT_STATUS.CANCELLED },
			{ new: true, runValidators: true, session }
		);

		await Booking.findByIdAndUpdate(
			updatedPayment?.booking,
			{ status: BOOKING_STATUS.CANCEL },
			{ new: true, runValidators: true, session }
		);

		await session.commitTransaction();
		session.endSession();

		return { success: true, message: "SSLCommerz Payment Successful." };
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		throw error;
	}
};

export const PaymentServices = {
	initializePayment,
	successPayment,
	failPayment,
	cancelPayment,
};
