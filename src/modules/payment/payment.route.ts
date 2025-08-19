import { Router } from "express";
import { PaymentControllers } from "./payment.controller";

export const PaymentRouter = Router();

PaymentRouter.post("/init-payment/:paymentId", PaymentControllers.initializePayment);
PaymentRouter.get("/ipn", PaymentControllers.verifyPayment);
PaymentRouter.get("/stats", PaymentControllers.paymentStats);
