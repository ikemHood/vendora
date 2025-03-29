import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";
import { createAccountSchema, loginSchema, resetPasswordSchema, forgotPasswordSchema } from "~/lib/validations/auth";
import crypto from "crypto";
import { sendPasswordResetEmail } from "~/server/services/email";
import { env } from "~/env";

const JWT_SECRET = env.JWT_SECRET || "your-secret-key";
const COOKIE_NAME = "access_token";

export const authRouter = createTRPCRouter({
    register: publicProcedure
        .input(createAccountSchema)
        .mutation(async ({ ctx, input }) => {
            const existingUser = await ctx.db.query.users.findFirst({
                where: eq(users.email, input.email),
            });

            if (existingUser) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "User already registered",
                });
            }

            const hashedPassword = await hash(input.password, 12);

            const [user] = await ctx.db
                .insert(users)
                .values({
                    ...input,
                    email: input.email,
                    name: input.fullName,
                    password: hashedPassword,
                })
                .returning();

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not created",
                });
            }

            const token = sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: "7d" }
            );

            const cookieStore = await cookies();
            cookieStore.set(COOKIE_NAME, token, {
                httpOnly: process.env.NODE_ENV === "production",
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60, // 7 days
            });

            return {
                success: true,
                requiresVerification: !user.isVerified,
                token: token,
            };
        }),

    login: publicProcedure
        .input(loginSchema)
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.query.users.findFirst({
                where: eq(users.email, input.email),
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Invalid email or password",
                });
            }

            const isValidPassword = await compare(input.password, user.password);

            if (!isValidPassword) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid email or password",
                });
            }

            const token = sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: "7d" }
            );

            const cookieStore = await cookies();
            cookieStore.set(COOKIE_NAME, token, {
                httpOnly: process.env.NODE_ENV === "production",
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60, // 7 days
            });

            return {
                success: true,
                requiresVerification: !user.isVerified,
                token: token,
            };
        }),

    logout: publicProcedure.mutation(async () => {
        const cookieStore = await cookies();
        cookieStore.delete(COOKIE_NAME);
        return { success: true };
    }),

    forgotPassword: publicProcedure
        .input(forgotPasswordSchema)
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.query.users.findFirst({
                where: eq(users.email, input.email),
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }

            const resetToken = crypto.randomBytes(32).toString("hex");
            const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

            await ctx.db
                .update(users)
                .set({
                    resetPasswordCode: resetToken,
                    resetPasswordExpires: resetTokenExpiry,
                })
                .where(eq(users.id, user.id));

            // Send password reset email
            await sendPasswordResetEmail(user.email, resetToken);

            return { success: true };
        }),

    resetPassword: publicProcedure
        .input(resetPasswordSchema)
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.query.users.findFirst({
                where: eq(users.resetPasswordCode, input.resetToken),
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Invalid or expired reset token",
                });
            }

            if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Reset token has expired",
                });
            }

            const hashedPassword = await hash(input.password, 12);

            await ctx.db
                .update(users)
                .set({
                    password: hashedPassword,
                    resetPasswordCode: null,
                    resetPasswordExpires: null,
                })
                .where(eq(users.id, user.id));

            return { success: true };
        }),

    getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
        const user = await ctx.db.query.users.findFirst({
            where: eq(users.id, ctx.userId),
            columns: {
                id: true,
                email: true,
                name: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found",
            });
        }

        return user;
    }),
}); 