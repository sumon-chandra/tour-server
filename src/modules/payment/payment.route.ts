import { Router } from "express";
import { PaymentControllers } from "./payment.controller";

export const PaymentRouter = Router();
PaymentRouter.post("/success", PaymentControllers.successPayment);
PaymentRouter.post("/fail", PaymentControllers.failPayment);
PaymentRouter.post("/cancel", PaymentControllers.cancelPayment);
PaymentRouter.post("/init-payment/:bookingId", PaymentControllers.initializePayment);
