import { ZodObject } from "zod"
import { createUserZodSchema } from "../modules/user/user.validation"
import { NextFunction, Request, Response } from "express";


export const validateRequest = (zodSchema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = await createUserZodSchema.parseAsync(req.body)
        next()
    } catch (error) {
        next(error)
    }
}