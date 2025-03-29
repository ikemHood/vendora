import { z } from "zod";

export const createAccountSchema = z.object({
    businessName: z
        .string()
        .min(2, "Business name must be at least 2 characters")
        .max(100, "Business name must be less than 100 characters"),

    fullName: z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name must be less than 100 characters"),

    phoneNumber: z
        .string()
        .regex(
            /^\+?[1-9]\d{1,14}$/,
            "Please enter a valid phone number following E.164 format"
        ),

    email: z
        .string()
        .email("Please enter a valid email address")
        .min(5, "Email must be at least 5 characters")
        .max(100, "Email must be less than 100 characters"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be less than 100 characters")
        .regex(
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
            "Password must contain at least one uppercase letter, one number, and one special character"
        ),
});

export const loginSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be less than 100 characters")
        .regex(
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
            "Password must contain at least one uppercase letter, one number, and one special character"
        ),
    confirmPassword: z
        .string()
        .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>; 