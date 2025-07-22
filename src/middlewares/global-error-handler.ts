import { NextFunction, Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';
import { envVars } from '../config/env';
import AppError from '../error-helpers/app-error';

export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500
    let message = "Something Went Wrong!!"

    if (error instanceof AppError) {
        statusCode = error.statusCode
        message = error.message
    } else if (error instanceof Error) {
        statusCode = 500
        message = error.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        error,
        stack: envVars.NODE_ENV === "development" ? error.stack : null
    })
}