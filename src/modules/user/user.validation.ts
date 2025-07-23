import { z } from 'zod';

export const createUserZodSchema = z.object({
    name: z.string({
        error: (issue) => {
            if (issue.code === "invalid_type" && typeof issue.input === "number") {
                return "Number is not a valid name"
            }

            if (issue.input === undefined) {
                return "Please tell us your name."
            }
            return "Name can’t be empty — we’d love to know what to call you."
        }
    }).min(1, 'Name can’t be empty — we’d love to know what to call you.'),

    email: z
        .string({
            error: (issue) => {
                if (issue.code === "invalid_type") {
                    return "Hmm, that doesn’t look like a valid email. Please check and try again."
                }
                return "Hmm, that doesn’t look like a valid email. Please check and try again."
            }
        })
        .email('Hmm, that doesn’t look like a valid email. Please check and try again.'),

    password: z
        .string()
        .min(8, 'Password should be at least 8 characters long.')
        .regex(/[a-zA-Z]/, 'Include at least one letter in your password.')
        .regex(/\d/, 'Don’t forget to add a number in your password.')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Please include at least one special character like !, @, or #.')
        .optional(),

    phone: z
        .string({
            error: (issue) => {
                if (issue.code === "invalid_type") {
                    return "Please enter a valid Phone number!"
                }
            }
        })
        .regex(/^(88017|017)\d{8}$/, 'Please enter a valid Bangladeshi phone number starting with 88017 or 017 — like 017XXXXXXXX or 88017XXXXXXXX.')
        .optional(),

    address: z
        .string({
            error: (issue) => {
                if (issue.code === "invalid_type") {
                    return "Looks like you are not provided the valid address."
                }
            }
        })
        .optional()
});
