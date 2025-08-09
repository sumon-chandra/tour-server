import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import AppError from "../error-helpers/app-error";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { User } from '../modules/user/user.model';
import { IsActive } from '../modules/user/user.interface';

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization

        if (!accessToken) {
            throw new AppError(403, "There is no token received")
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

        const isUserExist = await User.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new AppError(httpStatus.NOT_FOUND, "User does not exist.")
        }

        if (isUserExist.isActive === IsActive.BLOCKED) {
            throw new AppError(httpStatus.FORBIDDEN, "User is blocked.")
        }

        if (isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.FORBIDDEN, "User is inactive.")
        }

        if (isUserExist.isDeleted) {
            throw new AppError(httpStatus.FORBIDDEN, "User is deleted.")
        }

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You have no permission to access this page!")
        }

        req.user = verifiedToken

        next()
    } catch (error) {
        next(error)
    }
}
