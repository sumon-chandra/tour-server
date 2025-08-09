import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catch-async"
import { sendResponse } from "../../utils/send-response"
import httpStatusCode from "http-status-codes"
import { AuthServices } from "./auth.service"
import { setAuthCookies } from "../../utils/set-cookies"

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthServices.credentialsLogin(req.body)
    setAuthCookies(res, loginInfo)
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "User Login Successfully!",
        data: loginInfo
    })
})

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "User Logged Out Successfully!",
        data: null
    })
})

const getNewUserAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    const tokenInfo = await AuthServices.getNewUserAccessToken(refreshToken as string)
    setAuthCookies(res, tokenInfo)
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Get Access Token Successfully!",
        data: tokenInfo
    })
})

export const AuthControllers = {
    credentialsLogin,
    getNewUserAccessToken,
    logout
}