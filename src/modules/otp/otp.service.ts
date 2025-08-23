import httpStatus from "http-status-codes";
import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/send-email";
import AppError from "../../error-helpers/app-error";
import { User } from "../user/user.model";

const OTP_EXPIRATION = 2 * 60;

const generateOTP = (length = 6) => {
	return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
};

const sendOTP = async (email: string, name: string) => {
	const otp = generateOTP();
	const redisKey = `otp:${email}`;

	await redisClient.set(redisKey, otp, {
		expiration: {
			type: "EX",
			value: OTP_EXPIRATION,
		},
	});

	await sendEmail({
		to: email,
		subject: "Your OTP Code",
		templateName: "otp",
		templateData: {
			name,
			otp,
		},
	});
};

const verifyOTP = async (email: string, otp: string) => {
	const redisKey = `otp:${email}`;
	const savedOtp = await redisClient.get(redisKey);

	if (!savedOtp || savedOtp !== otp) {
		throw new AppError(httpStatus.FORBIDDEN, "Invalid OTP");
	}

	await Promise.all([User.updateOne({ email }, { isVerified: true }, { runValidators: true }), redisClient.del([redisKey])]);
};

export const OTPServices = {
	sendOTP,
	verifyOTP,
};
