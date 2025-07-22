import { NextFunction, Request, Response } from "express";
import httpStatusCode from "http-status-codes"
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catch-async";



const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body)

    res.status(httpStatusCode.CREATED).json({
        message: "User Created Successfully!",
        user
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.getAllUsers()

    res.status(httpStatusCode.OK).json({
        success: true,
        message: "Users retrieved successfully!",
        data: users
    })
})


export const userControllers = {
    createUser,
    getAllUsers
}