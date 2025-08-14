import z from "zod";
import { Types } from "mongoose";

export const createTourTypeZodSchema = z.object({
	name: z
		.string({
			error: (issue) => {
				if (issue.code === "invalid_type" && typeof issue.input === "number") {
					return "Please provide a valid name.";
				}

				if (issue.input === undefined) {
					return "Type name can not be empty!";
				}
				return "Name can’t be empty.";
			},
		})
		.min(1, "Name can’t be empty."),
});

export const createTourZodSchema = z.object({
	title: z
		.string({
			error: (issue) => {
				if (issue.code === "invalid_type") {
					return { message: "Title must be a text value." };
				}
				return { message: "Please provide a tour title." };
			},
		})
		.min(1, "Tour title cannot be empty."),

	slug: z
		.string({
			error: () => ({
				message: "Please provide a valid slug for the tour.",
			}),
		})
		.min(1, "Slug cannot be empty.")
		.optional(),

	description: z
		.string({
			error: () => ({
				message: "Description must be text.",
			}),
		})
		.optional(),

	images: z.array(z.string().url("Each image must be a valid URL.")).optional(),

	location: z
		.string({
			error: () => ({
				message: "Location must be a text value.",
			}),
		})
		.optional(),

	costFrom: z
		.number({
			error: () => ({
				message: "Cost must be a number (e.g., 500).",
			}),
		})
		.positive("Cost must be greater than zero.")
		.optional(),

	stateDate: z
		.preprocess(
			(val) => (typeof val === "string" || val instanceof Date ? new Date(val) : val),
			z.date({
				error: (issue) => {
					if (issue.code === "invalid_type") {
						return "Start date must be a valid date.";
					}
				},
			})
		)
		.optional(),

	endDate: z
		.preprocess(
			(val) => (typeof val === "string" || val instanceof Date ? new Date(val) : val),
			z.date({
				error: (issue) => {
					if (issue.code === "invalid_type") {
						return "End date must be a valid date.";
					}
				},
			})
		)
		.optional(),

	included: z.array(z.string({ message: "Each included item must be text." })).optional(),

	excluded: z.array(z.string({ message: "Each excluded item must be text." })).optional(),

	amenities: z.array(z.string({ message: "Each amenity must be text." })).optional(),

	tourPlan: z.array(z.string({ message: "Each tour plan entry must be text." })).optional(),

	maxGuest: z
		.number({
			error: () => ({
				message: "Max guest must be a number.",
			}),
		})
		.positive("Max guest must be greater than zero.")
		.optional(),

	minAge: z
		.number({
			error: () => ({
				message: "Minimum age must be a number.",
			}),
		})
		.positive("Minimum age must be greater than zero.")
		.optional(),

	division: z.string().refine((val) => Types.ObjectId.isValid(val), {
		message: "Please provide a valid Division ObjectId.",
	}),

	tourType: z
		.string()
		.refine((val) => Types.ObjectId.isValid(val), {
			message: "Please provide a valid Tour Type ObjectId.",
		})
		.optional(),
});

export const updateTourZodSchema = z.object({
	title: z
		.string({
			error: (issue) => {
				if (issue.code === "invalid_type") {
					return { message: "Title must be a text value." };
				}
				return { message: "Please provide a tour title." };
			},
		})
		.min(1, "Tour title cannot be empty.")
		.optional(),

	slug: z
		.string({
			error: () => ({
				message: "Please provide a valid slug for the tour.",
			}),
		})
		.min(1, "Slug cannot be empty.")
		.optional(),

	description: z
		.string({
			error: () => ({
				message: "Description must be text.",
			}),
		})
		.optional(),

	images: z.array(z.string().url("Each image must be a valid URL.")).optional(),

	location: z
		.string({
			error: () => ({
				message: "Location must be a text value.",
			}),
		})
		.optional(),

	costFrom: z
		.number({
			error: () => ({
				message: "Cost must be a number (e.g., 500).",
			}),
		})
		.positive("Cost must be greater than zero.")
		.optional(),

	stateDate: z
		.preprocess(
			(val) => (typeof val === "string" || val instanceof Date ? new Date(val) : val),
			z.date({
				error: (issue) => {
					if (issue.code === "invalid_type") {
						return "Start date must be a valid date.";
					}
				},
			})
		)
		.optional(),

	endDate: z
		.preprocess(
			(val) => (typeof val === "string" || val instanceof Date ? new Date(val) : val),
			z.date({
				error: (issue) => {
					if (issue.code === "invalid_type") {
						return "End date must be a valid date.";
					}
				},
			})
		)
		.optional(),

	included: z.array(z.string({ message: "Each included item must be text." })).optional(),

	excluded: z.array(z.string({ message: "Each excluded item must be text." })).optional(),

	amenities: z.array(z.string({ message: "Each amenity must be text." })).optional(),

	tourPlan: z.array(z.string({ message: "Each tour plan entry must be text." })).optional(),

	maxGuest: z
		.number({
			error: () => ({
				message: "Max guest must be a number.",
			}),
		})
		.positive("Max guest must be greater than zero.")
		.optional(),

	minAge: z
		.number({
			error: () => ({
				message: "Minimum age must be a number.",
			}),
		})
		.positive("Minimum age must be greater than zero.")
		.optional(),

	division: z
		.string()
		.refine((val) => Types.ObjectId.isValid(val), {
			message: "Please provide a valid Division ObjectId.",
		})
		.optional(),

	tourType: z
		.string()
		.refine((val) => Types.ObjectId.isValid(val), {
			message: "Please provide a valid Tour Type ObjectId.",
		})
		.optional(),
});
