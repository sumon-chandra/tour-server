import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAge = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAge = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
	const totalUsersPromise = User.countDocuments();
	const totalActiveUsersPromise = User.countDocuments({ isActive: IsActive.ACTIVE });
	const totalInActiveUsersPromise = User.countDocuments({ isActive: IsActive.INACTIVE });
	const totalBlockedUsersPromise = User.countDocuments({ isActive: IsActive.BLOCKED });
	const newUsersLast7DaysPromise = User.countDocuments({ createdAt: { $gte: sevenDaysAge } });
	const newUsersLast30DaysPromise = User.countDocuments({ createdAt: { $gte: thirtyDaysAge } });
	const usersByRolePromise = User.aggregate([
		{
			$group: {
				_id: "$role",
				count: { $sum: 1 },
			},
		},
	]);

	const [totalUsers, totalActiveUsers, totalInActiveUsers, totalBlockedUsers, newUsersLast7days, newUsersLast30days, usersByRole] = await Promise.all([
		totalUsersPromise,
		totalActiveUsersPromise,
		totalInActiveUsersPromise,
		totalBlockedUsersPromise,
		newUsersLast7DaysPromise,
		newUsersLast30DaysPromise,
		usersByRolePromise,
	]);

	return {
		totalUsers,
		totalActiveUsers,
		totalInActiveUsers,
		totalBlockedUsers,
		newUsersLast7days,
		newUsersLast30days,
		usersByRole,
	};
};

const getTourStats = async () => {
	const totalToursPromise = Tour.countDocuments();

	const totalTourByTypePromise = Tour.aggregate([
		{
			$lookup: {
				from: "tourtypes",
				localField: "tourType",
				foreignField: "_id",
				as: "type",
			},
		},
		{
			$unwind: "$type",
		},
		{
			$group: {
				_id: "$type.name",
				count: { $sum: 1 },
			},
		},
	]);

	const avgTourPricePromise = Tour.aggregate([
		{
			$group: {
				_id: null,
				averagePrice: { $avg: "$costFrom" },
			},
		},
	]);

	const totalTourByDivisionPromise = Tour.aggregate([
		{
			$lookup: {
				from: "divisions",
				localField: "division",
				foreignField: "_id",
				as: "division",
			},
		},
		{
			$unwind: "$division",
		},
		{
			$group: {
				_id: "$division.name",
				count: { $sum: 1 },
			},
		},
	]);

	const totalHighestBookedTourPromise = Booking.aggregate([
		{
			$group: {
				_id: "$tour",
				bookingCount: { $sum: 1 },
			},
		},
		{
			$sort: { bookingCount: -1 },
		},
		{
			$limit: 5,
		},
		{
			$lookup: {
				from: "tours",
				let: { tourId: "$_id" },
				pipeline: [
					{
						$match: {
							$expr: { $eq: ["$_id", "$$tourId"] },
						},
					},
				],
				as: "tour",
			},
		},
		{
			$unwind: "$tour",
		},
		{
			$project: {
				bookingCount: 1,
				"tour.title": 1,
				"tour.slug": 1,
			},
		},
	]);

	const [totalTours, totalTourByType, avgTourPrice, totalTourByDivision, totalHighestBookedTour] = await Promise.all([
		totalToursPromise,
		totalTourByTypePromise,
		avgTourPricePromise,
		totalTourByDivisionPromise,
		totalHighestBookedTourPromise,
	]);
	return {
		totalTours,
		totalTourByType,
		avgTourPrice,
		totalTourByDivision,
		totalHighestBookedTour,
	};
};

const getBookingStats = async () => {
	const totalBookingPromise = Booking.countDocuments();

	const totalBookingByStatusPromise = Booking.aggregate([
		{
			$group: {
				_id: "$status",
				bookingCount: { $sum: 1 },
			},
		},
	]);

	const totalBookingPerTourPromise = Booking.aggregate([
		{
			$group: {
				_id: "$tour",
				bookingCount: { $sum: 1 },
			},
		},
		{
			$sort: { bookingCount: -1 },
		},
		{
			$limit: 10,
		},
		{
			$lookup: {
				from: "tours",
				localField: "_id",
				foreignField: "_id",
				as: "tour",
			},
		},
		{
			$unwind: "$tour",
		},
		{
			$project: {
				bookingCount: 1,
				"tour.title": 1,
				"tour.slug": 1,
			},
		},
	]);

	const avgGuestCountPerBookingPromise = Booking.aggregate([
		{
			$group: {
				_id: null,
				avgGuestCount: { $avg: "$guestCount" },
			},
		},
	]);

	const bookingsLast7DaysPromise = Booking.countDocuments({
		createdAt: { $gte: sevenDaysAge },
	});
	const bookingsLast30DaysPromise = Booking.countDocuments({
		createdAt: { $gte: thirtyDaysAge },
	});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const totalBookingByUniqueUsersPromise = Booking.distinct("user").then((user: any) => user.length);

	const [
		totalBooking,
		totalBookingByStatus,
		totalBookingPerTour,
		avgGuestCountPerBooking,
		bookingsLast7Days,
		bookingsLast30Days,
		totalBookingByUniqueUsers,
	] = await Promise.all([
		totalBookingPromise,
		totalBookingByStatusPromise,
		totalBookingPerTourPromise,
		avgGuestCountPerBookingPromise,
		bookingsLast7DaysPromise,
		bookingsLast30DaysPromise,
		totalBookingByUniqueUsersPromise,
	]);
	return {
		totalBooking,
		totalBookingByStatus,
		totalBookingPerTour,
		avgGuestCountPerBooking,
		bookingsLast7Days,
		bookingsLast30Days,
		totalBookingByUniqueUsers,
	};
};

const getPaymentStats = async () => {
	const totalPaymentPromise = Payment.countDocuments();

	const totalPaymentByStatusPromise = Payment.aggregate([
		{
			$group: {
				_id: "$status",
				count: { $sum: 1 },
			},
		},
	]);

	const totalRevenuePromise = Payment.aggregate([
		{
			$match: { status: PAYMENT_STATUS.PAID },
		},
		{
			$group: {
				_id: null,
				totalRevenue: { $sum: "$amount" },
			},
		},
	]);

	const avgPaymentAmountPromise = Payment.aggregate([
		{
			$group: {
				_id: null,
				avgPaymentAMount: { $avg: "$amount" },
			},
		},
	]);

	const paymentGatewayDataPromise = Payment.aggregate([
		{
			$group: {
				_id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
				count: { $sum: 1 },
			},
		},
	]);

	const [totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData] = await Promise.all([
		totalPaymentPromise,
		totalPaymentByStatusPromise,
		totalRevenuePromise,
		avgPaymentAmountPromise,
		paymentGatewayDataPromise,
	]);
	return { totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData };
};

const getDivisionStats = async () => {
	return null;
};

export const StatsServices = {
	getBookingStats,
	getPaymentStats,
	getDivisionStats,
	getTourStats,
	getUserStats,
};
