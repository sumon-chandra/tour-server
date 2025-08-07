import AppError from "../../error-helpers/app-error"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { envVars } from "../../config/env"
import { generateToken } from "../../utils/jwt"

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload

    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Hmm, looks doesn't registered. Please register first.")
    }

    const isPasswordCorrect = await bcrypt.compare(password!, isUserExist.password!)

    if (!isPasswordCorrect) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const assessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRED_IN)

    return {
        assessToken
    }
}

export const AuthServices = {
    credentialsLogin
}