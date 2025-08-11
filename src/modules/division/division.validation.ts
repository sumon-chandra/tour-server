import { z } from "zod";

export const createDivisionZodSchema = z.object({
    name: z.string({
        error: (issue) => {
            if (issue.code === "invalid_type") {
                return "Please provide a valid division name!"
            }
            if (issue.input === undefined) {
                return "Please provide a division name!"
            }
            return "Please provide a division name!"
        }
    }),
    slug: z.string({
        error: (issue) => {
            if (issue.code === "invalid_type") {
                return "Please provide a valid slug"
            }
            return "Please provide a slug!"
        }
    }),
    thumbnail: z.string({
        error: (issue) => {
            if (issue.code === "invalid_type") {
                return "Please provide a valid thumbnail."
            }
        }
    }).optional(),
    description: z.string().min(10, { message: "Please provide minimum 10 characters in the description box." }).optional()
})

export const updateDivisionZodSchema = z.object({
    name: z.string({
        error: (issue) => {
            if (issue.code === "invalid_type") {
                return "Please provide a valid division name!"
            }
        }
    }).optional(),
    slug: z.string({
        error: (issue) => {
            if (issue.code === "invalid_type") {
                return "Please provide a valid slug"
            }
        }
    }).optional(),
    thumbnail: z.string({
        error: (issue) => {
            if (issue.code === "invalid_type") {
                return "Please provide a valid thumbnail."
            }
        }
    }).optional(),
    description: z.string()
        .min(10, { message: "Please provide minimum 10 characters in the description box." })
        .optional()
})