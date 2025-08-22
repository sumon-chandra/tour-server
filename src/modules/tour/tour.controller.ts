/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatusCode from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { TourServices } from "./tour.service";
import { sendResponse } from "../../utils/send-response";
import { ITour } from "./tour.interface";

const createTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const payload = {
		...req.body,
		images: (req.files as Express.Multer.File[]).map((file) => file.path),
	};
	const tour = await TourServices.createTour(payload);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.CREATED,
		message: "Tour Created Successfully!",
		data: tour,
	});
});

const getAllTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const query = req.query as Record<string, string>;
	const tours = await TourServices.getAllTour(query);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "All Tour Retrieved Successfully!",
		data: tours.data,
		meta: tours.meta,
	});
});

const getTourById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const tourId = req.params.id;
	const tour = await TourServices.getTourById(tourId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "Get tour Successfully!",
		data: tour,
	});
});

const updateTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const tourId = req.params.id;
	const payload: ITour = {
		...req.body,
		images: (req.files as Express.Multer.File[]).map((file) => file.path),
	};
	const updatedTour = await TourServices.updateTour(tourId, payload);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "Tour Updated Successfully!",
		data: updatedTour,
	});
});

const deleteTour = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const tourId = req.params.id;
	await TourServices.deleteTour(tourId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "Tour Deleted Successfully!",
		data: null,
	});
});

const createTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const tourType = await TourServices.createTourType(req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.CREATED,
		message: "Tour Type Created Successfully!",
		data: tourType,
	});
});

const getAllTourTypes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const tourTypes = await TourServices.getAllTourTypes();

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "Tour Type Retrieved Successfully!",
		data: tourTypes,
	});
});

const updateTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const typeId = req.params.id;
	const payload = req.body;
	const updatedTourType = await TourServices.updateTourType(payload, typeId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: "Tour Type Updated Successfully!",
		data: updatedTourType,
	});
});

const getTourTypeById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const typeId = req.params.id;
	const tourType = await TourServices.getTourTypeById(typeId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatusCode.OK,
		message: `Get ${tourType.name} Tour Type Successfully`,
		data: tourType,
	});
});

export const TourControllers = {
	createTourType,
	getAllTourTypes,
	updateTourType,
	getTourTypeById,
	createTour,
	getAllTour,
	updateTour,
	deleteTour,
	getTourById,
};
