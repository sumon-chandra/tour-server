import z from "zod";

export const createTourTypeZodSchema = z.object({
    name: z.string({
        error: (issue) => {
            if (issue.code === "invalid_type" && typeof issue.input === "number") {
                return "Please provide a valid name."
            }

            if (issue.input === undefined) {
                return "Type name can not be empty!"
            }
            return "Name can’t be empty."
        }
    }).min(1, 'Name can’t be empty.'),
})