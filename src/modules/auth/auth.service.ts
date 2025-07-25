import AppError from "../../error-helpers/app-error"
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model"
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload

    const ifUserExist = await User.findOne({ email })

    if (!ifUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Hmm, looks doesn't registered. Please register first.")
    }

    const isPasswordCorrect = await bcrypt.compare(password!, ifUserExist.password!)

    if (!isPasswordCorrect) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    return {
        email: ifUserExist.email
    }
}

export const AuthServices = {
    credentialsLogin
}