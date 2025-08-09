import AppError from "../../error-helpers/app-error"
import { IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import { createUserTokens } from "../../utils/user-token"
import { generateToken, verifyToken } from "../../utils/jwt"
import { envVars } from "../../config/env"
import { JwtPayload } from "jsonwebtoken"

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload

    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Hmm, looks doesn't registered. Please register first.")
    }

    const isPasswordCorrect = await bcrypt.compare(password!, isUserExist.password!)

    if (!isPasswordCorrect) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    const { password: pass, ...restUser } = isUserExist.toObject()
    const userTokens = createUserTokens(isUserExist)

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: restUser
    }
}
const getNewUserAccessToken = async (refreshToken: string) => {
    const verifiedToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload

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

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return {
        accessToken
    }
}

export const AuthServices = {
    credentialsLogin,
    getNewUserAccessToken
}