import { Request, Response } from "express";
import httpStatusCode from "http-status-codes"
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    try {

        const user = await UserServices.createUser(req.body)

        res.status(httpStatusCode.CREATED).json({
            message: "User Created Successfully!",
            user
        })
    } catch (error: any) {
        console.log({ error })
        res.status(httpStatusCode.BAD_REQUEST).json({
            message: `Something went wrong!!! ${error.message}`,
            error
        })
    }
}

export const userControllers = {
    createUser
}