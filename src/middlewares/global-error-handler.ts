import { NextFunction, Request, Response } from 'express';
import httpStatusCode from 'http-status-codes';
import { envVars } from '../config/env';
import AppError from '../error-helpers/app-error';
import mongoose from 'mongoose';

const handlerDuplicateError = (err: any) => {
    const matchedArray = err.message.match(/"([^"]*)"/)
    return {
        statusCode: httpStatusCode.FORBIDDEN,
        message: `${matchedArray[1]} already exist!!`
    }
}

const handlerCastError = (err: mongoose.Error) => {
    console.log(err)
    return {
        statusCode: httpStatusCode.FORBIDDEN,
        message: "Invalid MongoDB ObjectID. Please provide a valid id"
    }
}

export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500
    let message = "Something Went Wrong!!"

    if (error.code === 11000) {
        const simplifiedErr = handlerDuplicateError(error)
        statusCode = simplifiedErr.statusCode
        message = simplifiedErr.message
    } else if (error.name === "CastError") {
        const simplifiedErr = handlerCastError(error)
        statusCode = simplifiedErr.statusCode
        message = simplifiedErr.message
    } else if (error.name === "ZodError") {

    }

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