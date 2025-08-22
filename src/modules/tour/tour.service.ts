import httpStatus from "http-status-codes";
import AppError from "../../error-helpers/app-error";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { tourSearchableFields } from "./tour.constant";
import { QueryBuilder } from "../../utils/query-builder";
import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";

const createTour = async (payload: Partial<ITour>) => {
	const existingTour = await Tour.findOne({ title: payload.title });
	if (existingTour) {
		throw new AppError(httpStatus.CONFLICT, "Looks like this tour is already exist! Try with a new one.");
	}
	const newTour = await Tour.create(payload);
	return newTour;
};

const getAllTour = async (query: Record<string, string>) => {
	const queryBuilder = new QueryBuilder(Tour.find(), query);
	const tours = queryBuilder.filter().search(tourSearchableFields).sort().fields().paginate();

	const [data, meta] = await Promise.all([tours.build(), queryBuilder.getMeta()]);

	return {
		meta,
		data,
	};
};

const getTourById = async (tourId: string) => {
	const existingTour = await Tour.findById(tourId);
	if (!existingTour) {
		throw new AppError(httpStatus.NOT_FOUND, "The tour is not found.");
	}
	return {
		data: existingTour,
	};
};

const updateTour = async (tourId: string, payload: Partial<ITour>) => {
	const existingTour = await Tour.findById(tourId);
	if (!existingTour) {
		throw new AppError(httpStatus.NOT_FOUND, "The tour is not found.");
	}

	if (payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0) {
		payload.images = [...existingTour.images, ...payload.images];
	}
	if (payload.deletedImages && payload.deletedImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
		const restDBImages = existingTour.images.filter((imageUrl) => !payload.deletedImages?.includes(imageUrl));
		const updatedPayloadImages = (payload.images || [])
			.filter((imageUrl) => !payload.deletedImages?.includes(imageUrl))
			.filter((imageUrl) => !restDBImages?.includes(imageUrl));
		payload.images = [...restDBImages, ...updatedPayloadImages];
	}

	const updatedTour = await Tour.findByIdAndUpdate(tourId, payload, { new: true });

	if (payload.deletedImages && payload.deletedImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
		await Promise.all(payload.deletedImages.map((url) => deleteImageFromCLoudinary(url)));
	}

	return updatedTour;
};

const deleteTour = async (tourId: string) => {
	const existingTour = await Tour.findById(tourId);
	if (!existingTour) {
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
