import { IPayment } from "./payment.interface";

const initializePayment = async (paymentId: string, payload: Partial<IPayment>) => {};

const verifyPayment = async () => {};

const paymentStats = async () => {};

export const PaymentServices = {
	initializePayment,
	verifyPayment,
	paymentStats,
};
