import httpStatusCode from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catch-async"
import { sendResponse } from "../../utils/send-response"
import { DivisionServices } from './division.service';

const createDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const division = await DivisionServices.createDivision(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.CREATED,
        message: "Division Created Successfully!",
        data: division
    })
})

const updateDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const divisionId = req.params.id
    const payload = req.body
    const updatedDivision = await DivisionServices.updateDivision(divisionId, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.CREATED,
        message: "Division Updated Successfully!",
        data: updatedDivision
    })
})

const getAllDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const divisions = await DivisionServices.getAllDivision()

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Division Retrieved Successfully!",
        data: divisions
    })
})

const getDivisionById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const divisionId = req.params.id
    const division = await DivisionServices.getDivisionById(divisionId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Single Division Retrieved Successfully!",
        data: division
    })
})

const deleteDivision = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const divisionId = req.params.id
    await DivisionServices.deleteDivision(divisionId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Division Deleted Successfully!",
        data: null
    })
})

export const DivisionControllers = {
    createDivision,
    updateDivision,
    getAllDivision,
    getDivisionById,
    deleteDivision
}