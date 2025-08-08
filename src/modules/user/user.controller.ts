import { verifyToken } from './../../utils/jwt';
import { NextFunction, Request, Response } from "express";
import httpStatusCode from "http-status-codes"
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';



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

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    const verifiedToken = req.user
    const payload = req.body
    const user = await UserServices.updateUser(userId, payload, verifiedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.CREATED,
        message: "User Updated Successfully!",
        data: user
    })
})

export const userControllers = {
    createUser,
    getAllUsers,
    updateUser
}