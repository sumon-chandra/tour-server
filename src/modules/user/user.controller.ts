import { NextFunction, Request, Response } from "express";
import httpStatusCode from "http-status-codes"
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";



const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.CREATED,
        message: "User Created Successfully!",
        data: user
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userResponse = await UserServices.getAllUsers()

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "User Created Successfully!",
        data: userResponse.data,
        meta: { total: userResponse.total }
    })
})


export const userControllers = {
    createUser,
    getAllUsers
}