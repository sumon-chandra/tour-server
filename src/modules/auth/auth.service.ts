import AppError from "../../error-helpers/app-error";
import { IAuthProvider, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { createAccessTokenWithRefreshToken, createUserTokens } from "../../utils/user-token";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

const credentialsLogin = async (payload: Partial<IUser>) => {
	const { email, password } = payload;

	const isUserExist = await User.findOne({ email });

	if (!isUserExist) {
		throw new AppError(httpStatus.BAD_REQUEST, "Hmm, looks doesn't registered. Please register first.");
	}

	const isPasswordCorrect = await bcrypt.compare(password!, isUserExist.password!);

	if (!isPasswordCorrect) {
		throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password: _, ...restUser } = isUserExist.toObject();
	const userTokens = createUserTokens(isUserExist);

	return {
		accessToken: userTokens.accessToken,
		refreshToken: userTokens.refreshToken,
		user: restUser,
	};
};

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
	const user = await User.findById(decodedToken.userId);

	const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string);
	if (!isOldPasswordMatch) {
		throw new AppError(httpStatus.CONFLICT, "Old Password Does Not Match.");
	}

	user!.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
	user!.save();

	return true;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
	return {};
};

const setPassword = async (userId: string, newPassword: string) => {
	const user = await User.findById(userId);
	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!");
	}
	if (user.password && user.auths?.some((authProvider) => authProvider.provider === "google")) {
		throw new AppError(httpStatus.BAD_REQUEST, "You can change the password from your profile.");
	}

	const hashedPassword = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
	const auths: IAuthProvider[] = [...user.auths!, { provider: "credentials", providerId: user.email }];

	user.password = hashedPassword;
	user.auths = auths;

	user.save();
};

const getNewUserAccessToken = async (refreshToken: string) => {
	const newAccessToken = await createAccessTokenWithRefreshToken(refreshToken);

	return {
		accessToken: newAccessToken,
	};
};

export const AuthServices = {
	credentialsLogin,
	getNewUserAccessToken,
	changePassword,
	resetPassword,
	setPassword,
};
