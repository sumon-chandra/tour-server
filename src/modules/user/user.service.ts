import AppError from "../../error-helpers/app-error"
import { IAuthProvider, IUser } from "./user.interface"
import { User } from "./user.model"
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs"
import { envVars } from "../../config/env"

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload

    const ifUserExist = await User.findOne({ email })

    if (ifUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Hmm, looks like you have already registered. Please try with different user.")
    }

    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })

    return user
}

const getAllUsers = async () => {
    const users = await User.find({})
    const totalUsers = await User.countDocuments()

    return {
        total: totalUsers,
        data: users
    }
}


export const UserServices = {
    createUser,
    getAllUsers
}