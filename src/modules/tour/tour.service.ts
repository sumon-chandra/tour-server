import httpStatus from "http-status-codes";
import AppError from "../../error-helpers/app-error";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { tourSearchableFields } from "./tour.constant";
import { excludeField } from "../../constants";

const createTour = async (payload: Partial<ITour>) => {
	const isTourExist = await Tour.findOne({ title: payload.title });
	if (isTourExist) {
		throw new AppError(httpStatus.CONFLICT, "Looks like this tour is already exist! Try with a new one.");
	}
	const newTour = await Tour.create(payload);
	return newTour;
};

const getAllTour = async (query: Record<string, string>) => {
	const filter = query;
	const searchTerm = query.searchTerm || "";
	const sort = query.sort || "-createdAt";
	const fields = query.fields?.split(",").join(" ") || "";
	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 10;
	const skip = (page - 1) * limit;

	for (const field of excludeField) {
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete filter[field];
	}

	const searchQuery = {
		$or: tourSearchableFields.map((field) => ({ [field]: { $regex: searchTerm, $options: "i" } })),
	};

	const tours = await Tour.find(searchQuery).find(filter).sort(sort).select(fields).limit(limit).skip(skip);
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
