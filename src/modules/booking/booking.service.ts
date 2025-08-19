/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../error-helpers/app-error";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Tour } from "../tour/tour.model";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { SSLCommerzServices } from "../sslCommerz/sslCommerz.service";

const generateTransactionId = () => {
	const timestamp = Date.now().toString(36).toUpperCase();
	const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
	return `TXN${timestamp}${randomPart}`;
};

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
	const transactionId = generateTransactionId();
	const session = await Booking.startSession();
	session.startTransaction();
	try {
		const user = await User.findById(userId);
		if (!user?.phone || !user?.address) {
			throw new AppError(httpStatus.BAD_REQUEST, "Please update your profile before booking the tour.");
		}
		const tour = await Tour.findById(payload.tour).select("costFrom");
		if (!tour?.costFrom) {
			throw new AppError(httpStatus.BAD_REQUEST, "No tour cost found.");
		}
		const amount = Number(tour.costFrom) * Number(payload.guestCount);

		const booking = await Booking.create(
			[
				{
					user: userId,
					status: BOOKING_STATUS.PENDING,
					...payload,
				},
			],
			{ session }
		);

		const payment = await Payment.create(
			[
				{
					booking: booking[0]._id,
					status: PAYMENT_STATUS.UNPAID,
					transactionId,
					amount,
				},
			],
			{ session }
		);
		const updatedBooking = await Booking.findByIdAndUpdate(
			booking[0]._id,
			{ payment: payment[0]._id },
			{ new: true, runValidators: true, session }
		)
			.populate("user", "name phone email")
			.populate("tour", "title costFrom")
			.populate("payment");

		const sslPayload = {
			address: (updatedBooking?.user as any).address,
			email: (updatedBooking?.user as any).email,
			phoneNumber: (updatedBooking?.user as any).phone,
			name: (updatedBooking?.user as any).name,
			transactionId,
			amount,
		};
		const sslPayment = await SSLCommerzServices.sslCommerzPaymentInit(sslPayload);

		await session.commitTransaction();
		session.endSession();
		return {
			paymentUrl: sslPayment.GatewayPageURL,
			booking: updatedBooking,
		};
	} catch (error: any) {
		await session.abortTransaction();
		session.endSession();
		throw error;
	}
};

const getMyBookings = async () => {};

const getBookingById = async (bookingId: string) => {};

const getAllBookings = async () => {};

const updateBookingStatus = async (bookingId: string, status: BOOKING_STATUS) => {};

export const BookingServices = {
	createBooking,
	getMyBookings,
	getBookingById,
	getAllBookings,
	updateBookingStatus,
};
