import httpStatus from "http-status-codes";
import AppError from "../../error-helpers/app-error";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

const createTour = async (payload: Partial<ITour>) => {
	const slug = payload.title?.toLowerCase().split(" ").join("-");
	const isTourExist = await Tour.findOne({ slug });

	if (isTourExist) {
		throw new AppError(httpStatus.CONFLICT, "Looks like this tour is already exist! Try with a new one.");
	}

	payload.slug = slug;

	const newTour = await Tour.create(payload);
	return newTour;
};

const getAllTour = async () => {
	const tours = await Tour.find({});
	const totalTour = await Tour.countDocuments();

	return {
		total: totalTour,
		data: tours,
	};
};

const getTourById = async (tourId: string) => {
	const isTourExist = await Tour.findById(tourId);
	if (!isTourExist) {
		throw new AppError(httpStatus.NOT_FOUND, "The tour is not found.");
	}
	return {
		data: isTourExist,
	};
};

const updateTour = async (tourId: string, payload: Partial<ITour>) => {
	const isTourExist = await Tour.findById(tourId);
	if (!isTourExist) {
		throw new AppError(httpStatus.NOT_FOUND, "The tour is not found.");
	}

	if (payload.title) {
		const slug = payload.title?.toLowerCase().split(" ").join("-");
		payload.slug = slug;
	}

	const updatedTour = await Tour.findByIdAndUpdate(tourId, payload, { new: true });
	return updatedTour;
};

const deleteTour = async (tourId: string) => {
	const isTourExist = await Tour.findById(tourId);
	if (!isTourExist) {
		throw new AppError(httpStatus.NOT_FOUND, "The tour is not found.");
	}

	await Tour.findByIdAndDelete(tourId);
};

const createTourType = async (payload: Partial<ITourType>) => {
	const isTourTypeExist = await TourType.findOne({ name: payload.name });

	if (isTourTypeExist) {
		throw new AppError(httpStatus.CONFLICT, "This tour type is already exist. Try with a new one.");
	}

	const newTourType = await TourType.create(payload);
	return newTourType;
};

const getAllTourTypes = async () => {
	const tourTypes = await TourType.find({});
	const totalTypes = await TourType.countDocuments();

	return {
		total: totalTypes,
		data: tourTypes,
	};
};

const updateTourType = async (payload: Partial<ITourType>, typeId: string) => {
	const isTourTypeExist = await TourType.findById(typeId);

	if (!isTourTypeExist) {
		throw new AppError(httpStatus.NOT_FOUND, "The tour type is not found!");
	}

	const newUpdatedTourType = await TourType.findByIdAndUpdate(typeId, payload, { new: true });
	return newUpdatedTourType;
};

const getTourTypeById = async (typeId: string) => {
	const isTourTypeExist = await TourType.findById(typeId);

	if (!isTourTypeExist) {
		throw new AppError(httpStatus.NOT_FOUND, "The tour type is not found!");
	}

	return isTourTypeExist;
};

export const TourServices = {
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
