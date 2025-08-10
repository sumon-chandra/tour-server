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

export const TourControllers = {
    createTourType
}