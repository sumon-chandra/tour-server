import { Types } from "mongoose";

export enum IsActive {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
	BLOCKED = "BLOCKED",
}

export enum Role {
	ADMIN = "ADMIN",
	USER = "USER",
	GUIDE = "GUIDE",
	SUPER_ADMIN = "SUPER_ADMIN",
}

export interface IAuthProvider {
	provider: "google" | "credentials";
	providerId: string;
}

export interface IUser {
	_id?: Types.ObjectId;
	name: string;
	email: string;
	password?: string;
	phone?: string;
	address?: string;
	picture?: string;
	isVerified?: boolean;
	isActive?: IsActive;
	isDeleted?: string;

	auths?: IAuthProvider[];
	role?: Role;
	bookings?: Types.ObjectId[];
	guides?: Types.ObjectId[];
	createdAt?: Date;
}
