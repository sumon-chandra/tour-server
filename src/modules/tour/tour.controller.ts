import httpStatusCode from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catch-async"
import { TourServices } from "./tour.service"
import { sendResponse } from "../../utils/send-response"


const createTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourServices.createTourType(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.CREATED,
        message: "Tour Type Created Successfully!",
        data: tourType
    })
})

const getAllTourTypes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tourTypes = await TourServices.getAllTourTypes()

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Tour Type Retrieved Successfully!",
        data: tourTypes
    })
})

const updateTourType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const typeId = req.params.id
    const payload = req.body
    const updatedTourType = await TourServices.updateTourType(payload, typeId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Tour Type Updated Successfully!",
        data: updatedTourType
    })
})

const getTourTypeById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const typeId = req.params.id
    const tourType = await TourServices.getTourTypeById(typeId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: `Get ${tourType.name} Tour Type Successfully`,
        data: tourType
    })
})

export const TourControllers = {
    createTourType,
    getAllTourTypes,
    updateTourType,
    getTourTypeById
}