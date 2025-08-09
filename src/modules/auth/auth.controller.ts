import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catch-async"
import { sendResponse } from "../../utils/send-response"
import httpStatusCode from "http-status-codes"
import { AuthServices } from "./auth.service"

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthServices.credentialsLogin(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "User Login Successfully!",
        data: loginInfo
    })
})
const getNewUserAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const refreshToken = req.cookies.refreshToken
    const refreshToken = req.headers.authorization
    const tokenInfo = await AuthServices.getNewUserAccessToken(refreshToken as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Get Access Token Successfully!",
        data: tokenInfo
    })
})

export const AuthControllers = {
    credentialsLogin,
    getNewUserAccessToken
}