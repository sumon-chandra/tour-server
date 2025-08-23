import { Router } from "express";
import { PaymentControllers } from "./payment.controller";
import { checkAuth } from "../../middlewares/check-auth";
import { Role } from "../user/user.interface";

export const PaymentRouter = Router();
PaymentRouter.post("/success", PaymentControllers.successPayment);
PaymentRouter.post("/fail", PaymentControllers.failPayment);
PaymentRouter.post("/cancel", PaymentControllers.cancelPayment);
PaymentRouter.post("/init-payment/:bookingId", PaymentControllers.initializePayment);
PaymentRouter.get("/invoice/:paymentId", checkAuth(...Object.values(Role)), PaymentControllers.getPaymentInvoiceUrl);
