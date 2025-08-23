import { createUserTokens } from "./../../utils/user-token";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import httpStatusCode from "http-status-codes";
import { AuthServices } from "./auth.service";
import { setAuthCookies } from "../../utils/set-cookies";
import AppError from "../../error-helpers/app-error";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
	const loginInfo = await AuthServices.credentialsLogin(req.body);
	setAuthCookies(res, loginInfo);
	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "User Login Successfully!",
		data: loginInfo,
	});
});

const logout = catchAsync(async (req: Request, res: Response) => {
	res.clearCookie("accessToken", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});
	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "User Logged Out Successfully!",
		data: null,
	});
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
	const { oldPassword, newPassword } = req.body;
	const decodedToken = req.user;

	if (!decodedToken) {
		throw new AppError(httpStatusCode.NOT_FOUND, "User Not Found!");
	}

	await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "Password Changed Successfully!",
		data: null,
	});
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const { id, newPassword } = req.body;
	const decodedToken = req.user as JwtPayload;
	await AuthServices.resetPassword(id, newPassword, decodedToken);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "Password Reset Successfully!",
		data: null,
	});
});

const setPassword = catchAsync(async (req: Request, res: Response) => {
	const { password } = req.body;
	const decodedToken = req.user as JwtPayload;

	await AuthServices.setPassword(decodedToken.userId, password);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "Password Changed Successfully!",
		data: null,
	});
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
	const { email } = req.body;

	await AuthServices.forgotPassword(email);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "Email sent Successfully!",
		data: null,
	});
});

const getNewUserAccessToken = catchAsync(async (req: Request, res: Response) => {
	const refreshToken = req.cookies.refreshToken;
	const tokenInfo = await AuthServices.getNewUserAccessToken(refreshToken as string);
	setAuthCookies(res, tokenInfo);
	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "Get Access Token Successfully!",
		data: tokenInfo,
	});
});

const googleCallbackController = catchAsync(async (req: Request, res: Response) => {
	let redirectTo = req.query.state ? (req.query.state as string) : "";
	if (redirectTo.startsWith("/")) {
		redirectTo = redirectTo.slice(1);
	}
	const user = req.user;

	if (!user) {
		throw new AppError(httpStatusCode.NOT_FOUND, "User Not Found!");
	}

	const tokenInfo = createUserTokens(user);
	setAuthCookies(res, tokenInfo);
	res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
});

export const AuthControllers = {
	credentialsLogin,
	getNewUserAccessToken,
	logout,
	resetPassword,
	googleCallbackController,
	setPassword,
	changePassword,
	forgotPassword,
};
