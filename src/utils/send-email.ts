/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import nodemailer from "nodemailer";
import AppError from "../error-helpers/app-error";
import { envVars } from "../config/env";
import path from "node:path";
import ejs from "ejs";

interface SendEmailTypes {
	to: string;
	subject: string;
	templateName: string;
	templateData?: Record<string, any>;
	attachments?: {
		fileName: string;
		content: Buffer | string;
		contentType: string;
	}[];
}

const transporter = nodemailer.createTransport({
	secure: true,
	auth: {
		user: envVars.SMTP_USER,
		pass: envVars.SMTP_PASS,
	},
	host: envVars.SMTP_HOST,
	port: Number(envVars.SMTP_PORT),
});

export const sendEmail = async ({ to, subject, templateName, attachments, templateData }: SendEmailTypes) => {
	try {
		const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
		const html = await ejs.renderFile(templatePath, templateData);
		const info = await transporter.sendMail({
			from: envVars.SMTP_FROM,
			to: to,
			subject: subject,
			html: html,
			attachments: attachments?.map((attachment) => ({
				fileName: attachment.fileName,
				content: attachment.content,
				contentType: attachment.contentType,
			})),
		});
		console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
	} catch (error: any) {
		console.log("Email sending error", error.message);
		throw new AppError(httpStatus.BAD_REQUEST, "Failed to send email. Please try again.");
	}
};
