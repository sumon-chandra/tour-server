import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { Request, Response } from "express";
import { OTPServices } from "./otp.service";
import { User } from "../user/user.model";
import AppError from "../../error-helpers/app-error";

const sendOTP = catchAsync(async (req: Request, res: Response) => {
	const { name, email } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
	}
	if (user?.isVerified) {
		throw new AppError(httpStatus.CONFLICT, "You have already verified your account.");
	}

	await OTPServices.sendOTP(email, name);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "OTP Send Successfully!",
		data: null,
	});
});

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
	const { email, otp } = req.body;

	const user = await User.findOne({ email });
	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
	}
	if (user?.isVerified) {
		throw new AppError(httpStatus.CONFLICT, "You have already verified your account.");
	}
	await OTPServices.verifyOTP(email, otp);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "OTP Verified Successfully!",
		data: null,
	});
});

export const OTPControllers = {
	sendOTP,
	verifyOTP,
};
