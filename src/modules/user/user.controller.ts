import { Request, Response } from "express";
import httpStatusCode from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req: Request, res: Response) => {
	const user = await UserServices.createUser(req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.CREATED,
		message: "User Created Successfully!",
		data: user,
	});
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const query = req.query as Record<string, string>;
	const response = await UserServices.getAllUsers(query);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "User Created Successfully!",
		data: response.data,
		meta: response.meta,
	});
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
	const userId = req.params.id;
	const verifiedToken = req.user;
	const payload = req.body;
	const user = await UserServices.updateUser(userId, payload, verifiedToken!);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.CREATED,
		message: "User Updated Successfully!",
		data: user,
	});
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
	const userId = req.params.id;
	const response = await UserServices.getSingleUser(userId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "User Retrieve Successfully!",
		data: response.data,
	});
});

const getMe = catchAsync(async (req: Request, res: Response) => {
	const decodedToken = req.user as JwtPayload;
	const response = await UserServices.getMe(decodedToken.userId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "User Retrieve Successfully!",
		data: response.data,
	});
});

export const userControllers = {
	createUser,
	getAllUsers,
	updateUser,
	getSingleUser,
	getMe,
};
