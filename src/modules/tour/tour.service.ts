import httpStatus from 'http-status-codes';
import AppError from "../../error-helpers/app-error";
import { ITourType } from "./tour.interface";
import { TourType } from "./tour.model";

const createTourType = async (payload: ITourType) => {
    const isTourTypeExist = await TourType.findOne({ name: payload.name })

    if (isTourTypeExist) {
        throw new AppError(httpStatus.CONFLICT, "This tour type is already exist. Try with a new one.")
    }

    const newTourType = await TourType.create(payload)
    return newTourType
}

const getAllTourTypes = async () => {
    const tourTypes = await TourType.find({})
    const totalTypes = await TourType.countDocuments()

    return {
        total: totalTypes,
        data: tourTypes
    }
}

const updateTourType = async (payload: ITourType, typeId: string) => {
    const isTourTypeExist = await TourType.findById(typeId)

    if (!isTourTypeExist) {
        throw new AppError(httpStatus.NOT_FOUND, "The tour type is not found!")
    }

    const newUpdatedTourType = await TourType.findByIdAndUpdate(typeId, payload, { new: true })
    return newUpdatedTourType
}

const getTourTypeById = async (typeId: string) => {
    const isTourTypeExist = await TourType.findById(typeId)

    if (!isTourTypeExist) {
        throw new AppError(httpStatus.NOT_FOUND, "The tour type is not found!")
    }

    return isTourTypeExist
}

export const TourServices = {
    createTourType,
    getAllTourTypes,
    updateTourType,
    getTourTypeById
}