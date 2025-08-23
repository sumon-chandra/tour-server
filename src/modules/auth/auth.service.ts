import AppError from "../../error-helpers/app-error";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { createAccessTokenWithRefreshToken, createUserTokens } from "../../utils/user-token";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/send-email";

const credentialsLogin = async (payload: Partial<IUser>) => {
	const { email, password } = payload;

	const existingUser = await User.findOne({ email });

	if (!existingUser) {
		throw new AppError(httpStatus.BAD_REQUEST, "Hmm, looks doesn't registered. Please register first.");
	}

	if (existingUser.isActive === IsActive.BLOCKED || existingUser.isActive === IsActive.INACTIVE) {
		throw new AppError(httpStatus.FORBIDDEN, `User is ${existingUser.isActive}`);
	}

	if (existingUser.isDeleted) {
		throw new AppError(httpStatus.FORBIDDEN, "User is deleted.");
	}

	if (!existingUser.isVerified) {
		throw new AppError(httpStatus.FORBIDDEN, "User is not verified.");
	}

	const isPasswordCorrect = await bcrypt.compare(password!, existingUser.password!);

	if (!isPasswordCorrect) {
		throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password: _, ...restUser } = existingUser.toObject();
	const userTokens = createUserTokens(existingUser);

	return {
		accessToken: userTokens.accessToken,
		refreshToken: userTokens.refreshToken,
		user: restUser,
	};
};

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
	if (oldPassword === newPassword) {
		throw new AppError(httpStatus.CONFLICT, "You can not use the same password. Try different one.");
	}

	const user = await User.findById(decodedToken.userId);
	const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string);

	if (!isOldPasswordMatch) {
		throw new AppError(httpStatus.CONFLICT, "Old Password Does Not Match.");
	}

	user!.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
	user!.save();
};

const resetPassword = async (id: string, newPassword: string, decodedToken: JwtPayload) => {
	if (id !== decodedToken.userId) {
		throw new AppError(httpStatus.BAD_REQUEST, "You can not reset your password.");
	}
	const isUserExist = await User.findById(decodedToken.userId);
	if (!isUserExist) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found.");
	}

	isUserExist.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));
	isUserExist.save();
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

const forgotPassword = async (email: string) => {
	const isUserExist = await User.findOne({ email });
	if (isUserExist?.isActive === IsActive.BLOCKED || isUserExist?.isActive === IsActive.INACTIVE) {
		throw new AppError(httpStatus.FORBIDDEN, `User is ${isUserExist.isActive}`);
	}

	if (isUserExist?.isDeleted) {
		throw new AppError(httpStatus.FORBIDDEN, "User is deleted.");
	}

	if (!isUserExist?.isVerified) {
		throw new AppError(httpStatus.FORBIDDEN, "User is not verified.");
	}

	const jwtPayload = {
		userId: isUserExist?._id,
		email: isUserExist?.email,
		role: isUserExist?.role,
	};
	const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
		expiresIn: "10m",
	});

	const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
	sendEmail({
		to: isUserExist.email,
		subject: "Reset Password",
		templateName: "forgot-password",
		templateData: {
			name: isUserExist.name,
			resetUILink,
		},
	});
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
	forgotPassword,
};
