import AppError from "../../error-helpers/app-error";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/query-builder";
import { userSearchableFields } from "./user.constant";

const createUser = async (payload: Partial<IUser>) => {
	const { email, password, ...rest } = payload;

	const ifUserExist = await User.findOne({ email });

	if (ifUserExist) {
		throw new AppError(httpStatus.BAD_REQUEST, "Hmm, looks like you have already registered. Please try with different user.");
	}

	const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

	const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string };

	const user = await User.create({
		email,
		password: hashedPassword,
		auths: [authProvider],
		...rest,
	});

	return user;
};

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
	if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
		if (userId !== decodedToken.userId) {
			throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized.");
		}
	}

	const isUserExist = await User.findById(userId);

	if (!isUserExist) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found!");
	}

	if (decodedToken.role === Role.ADMIN && isUserExist.role === Role.SUPER_ADMIN) {
		throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized.");
	}

	if (payload.role) {
		if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
			throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
		}
	}

	if (payload.isActive || payload.isDeleted || payload.isVerified) {
		if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
			throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
		}
	}

	const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true }).select("-password");

	return newUpdatedUser;
};

const getAllUsers = async (query: Record<string, string>) => {
	const queryBuilder = new QueryBuilder(User.find(), query);
	const users = queryBuilder.filter().search(userSearchableFields).sort().fields().paginate();
	const [data, meta] = await Promise.all([users.build(), queryBuilder.getMeta()]);

	return { data, meta };
};

const getSingleUser = async (userId: string) => {
	const user = await User.findById(userId).select("-password");

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
	}
	return { data: user };
};

const getMe = async (userId: string) => {
	const user = await User.findById(userId).select("-password");

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
	}
	return { data: user };
};

export const UserServices = {
	createUser,
	getAllUsers,
	updateUser,
	getSingleUser,
	getMe,
};
