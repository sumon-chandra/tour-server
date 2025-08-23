/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";
import AppError from "../error-helpers/app-error";
import stream from "stream";

cloudinary.config({
	cloud_name: envVars.CLOUDINARY_NAME,
	api_key: envVars.CLOUDINARY_API_KEY,
	api_secret: envVars.CLOUDINARY_API_SECRET,
});

export const uploadBufferToCloudinary = async (buffer: Buffer, fileName: string): Promise<UploadApiResponse | undefined> => {
	try {
		return new Promise((resolve, reject) => {
			const publicId = `pdf/${fileName}-${Date.now()}`;
			const bufferStream = new stream.PassThrough();
			bufferStream.end(buffer);

			cloudinary.uploader
				.upload_stream(
					{
						resource_type: "auto",
						public_id: publicId,
						folder: "pdf",
					},
					(error, result) => {
						if (error) {
							return reject(error);
						}
						resolve(result);
					}
				)
				.end(buffer);
		});
	} catch (error: any) {
		console.log("Failed to upload buffer to the cloudinary", error);
		throw new AppError(httpStatus.BAD_GATEWAY, "Failed to upload buffer to the Cloudinary");
	}
};

export const deleteImageFromCLoudinary = async (url: string) => {
	try {
		const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
		const match = url.match(regex);

		if (match && match[1]) {
			const public_id = match[1];
			await cloudinary.uploader.destroy(public_id);
		}
	} catch (error: any) {
		throw new AppError(401, "Cloudinary image deletion failed", error.message);
	}
};

export const cloudinaryConfig = cloudinary;
