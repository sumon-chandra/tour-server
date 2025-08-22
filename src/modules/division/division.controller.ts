import httpStatusCode from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { DivisionServices } from "./division.service";

const createDivision = catchAsync(async (req: Request, res: Response) => {
	const payload = {
		...req.body,
		thumbnail: req.file?.path,
	};
	const division = await DivisionServices.createDivision(payload);
	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.CREATED,
		message: "Division Created Successfully!",
		data: division,
	});
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
	const divisionId = req.params.id;
	const payload = {
		...req.body,
		thumbnail: req.file?.path,
	};
	const updatedDivision = await DivisionServices.updateDivision(divisionId, payload);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.CREATED,
		message: "Division Updated Successfully!",
		data: updatedDivision,
	});
});

const getAllDivision = catchAsync(async (req: Request, res: Response) => {
	const divisions = await DivisionServices.getAllDivision();

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "Division Retrieved Successfully!",
		data: divisions,
	});
});

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
	const slug = req.params.slug;
	const division = await DivisionServices.getSingleDivision(slug);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "Single Division Retrieved Successfully!",
		data: division,
	});
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
	const divisionId = req.params.id;
	await DivisionServices.deleteDivision(divisionId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "Division Deleted Successfully!",
		data: null,
	});
});

export const DivisionControllers = {
	createDivision,
	updateDivision,
	getAllDivision,
	getSingleDivision,
	deleteDivision,
};
