import z from "zod"
import {
    MAX_FIRST_NAME_LENGTH,
    MIN_FIRST_NAME_LENGTH,
    MIN_LAST_NAME_LENGTH,
    MAX_LAST_NAME_LENGTH,
    MAX_LAST_NAME_LENGTH_MESSAGE,
    MIN_FIRST_NAME_LENGTH_MESSAGE,
    MIN_LAST_NAME_LENGTH_MESSAGE,
    MAX_FIRST_NAME_LENGTH_MESSAGE,
    PHONE_REGEX,
    PHONE_REGEX_MESSAGE,
    MIN_PASSWORD_LENGTH,
    MIN_PASSWORD_LENGTH_MESSAGE,
    MAX_PASSWORD_LENGTH,
    MAX_PASSWORD_LENGTH_MESSAGE,
    MAX_BIO_LENGTH,
    MAX_BIO_LENGTH_MESSAGE
} from "../../../constants/admin.constants.js";

const adminLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(MIN_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH_MESSAGE).max(MAX_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH_MESSAGE),
})


const adminRegisterSchema = z.object({
    firstName:
        z.string()
            .min(MIN_FIRST_NAME_LENGTH, MIN_FIRST_NAME_LENGTH_MESSAGE)
            .max(MAX_FIRST_NAME_LENGTH, MAX_FIRST_NAME_LENGTH_MESSAGE),
    lastName:
        z.string()
            .min(MIN_LAST_NAME_LENGTH, MIN_LAST_NAME_LENGTH_MESSAGE)
            .max(MAX_LAST_NAME_LENGTH, MAX_LAST_NAME_LENGTH_MESSAGE),
    email: z.string().email(),
    password:
        z.string()
            .min(MIN_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH_MESSAGE)
            .max(MAX_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH_MESSAGE)
            .max(MAX_BIO_LENGTH, MAX_BIO_LENGTH_MESSAGE),
    phone: z.string().regex(PHONE_REGEX, PHONE_REGEX_MESSAGE),
    bio: z.string().max(MAX_BIO_LENGTH, MAX_BIO_LENGTH_MESSAGE).optional(),
})

const adminUpdateSchema = z.object({
    firstName:
        z.string()
            .min(MIN_FIRST_NAME_LENGTH, MIN_FIRST_NAME_LENGTH_MESSAGE)
            .max(MAX_FIRST_NAME_LENGTH, MAX_FIRST_NAME_LENGTH_MESSAGE)
            .optional(),
    lastName:
        z.string()
            .min(MIN_LAST_NAME_LENGTH, MIN_LAST_NAME_LENGTH_MESSAGE)
            .max(MAX_LAST_NAME_LENGTH, MAX_LAST_NAME_LENGTH_MESSAGE)
            .optional(),
    email: z.string().email().optional(),
    phone: z.string().regex(PHONE_REGEX, PHONE_REGEX_MESSAGE).optional(),
    bio: z.string().max(MAX_BIO_LENGTH, MAX_BIO_LENGTH_MESSAGE).optional(),
})

const adminUpdatePassword = z.object({
    oldPassword:
        z.string()
            .min(MIN_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH_MESSAGE)
            .max(MAX_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH_MESSAGE),
    newPassword:
        z.string()
            .min(MIN_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH_MESSAGE)
            .max(MAX_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH_MESSAGE),
})

const adminForgotPasswordSchema = z.object({
    email: z.string().email(),
})

const resetPasswordSchema = z.object({
    email: z.string().email(),
    otp: z.string(),
    newPassword:
        z.string()
            .min(MIN_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH_MESSAGE)
            .max(MAX_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH_MESSAGE),
})

export {
    adminLoginSchema,
    adminRegisterSchema,
    adminUpdateSchema,
    adminUpdatePassword,
    adminForgotPasswordSchema,
    resetPasswordSchema
}