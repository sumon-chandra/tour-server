import AppError from "../../error-helpers/app-error"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import { createAccessTokenWithRefreshToken, createUserTokens } from "../../utils/user-token"

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
    const newAccessToken = createAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }
}

export const AuthServices = {
    credentialsLogin,
    getNewUserAccessToken
}