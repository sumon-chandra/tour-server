import httpStatus from 'http-status-codes';
import AppError from "../../error-helpers/app-error";
import { ITourType } from "./tour.interface";
import { TourType } from "./tour.model";


const createTourType = async (payload: ITourType) => {
    const isTourTypeExist = await TourType.findById(payload._id)

    if (isTourTypeExist) {
        throw new AppError(httpStatus.CONFLICT, "This tour type is already exist. Try with a new one.")
    }

    const newTourType = await TourType.create(payload)
    return newTourType
}

export const TourServices = {
    createTourType
}