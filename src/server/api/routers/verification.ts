import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { documentVerifications, users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { businessVerificationSchema } from "~/lib/validations/business";

export const verificationRouter = createTRPCRouter({
    submitBusinessVerification: protectedProcedure
        .input(businessVerificationSchema)
        .mutation(async ({ ctx, input }) => {
            // Check if user is already verified
            const user = await ctx.db.query.users.findFirst({
                where: eq(users.id, ctx.userId),
                with: {
                    documentVerifications: true,
                },
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }

            if (user.isVerified) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User is already verified",
                });
            }

            // TODO: Upload files to storage (e.g., S3)
            // For now, we'll just store the file names
            const idDocPath = `verifications/${ctx.userId}/id_doc.${input.idDocument.name.split('.').pop()}`;
            const cacDocPath = `verifications/${ctx.userId}/cac_doc.${input.cacDocument.name.split('.').pop()}`;

            const [verification] = await ctx.db
                .insert(documentVerifications)
                .values({
                    userId: ctx.userId,
                    idDoc: idDocPath,
                    cacDoc: cacDocPath,
                    uploadedDocAt: new Date(),
                    documentType: "cac_registration",
                    verificationStatus: "pending",
                })
                .returning();

            if (!verification) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create verification record",
                });
            }

            await ctx.db
                .update(users)
                .set({
                    documentVerificationId: verification.id,
                })
                .where(eq(users.id, ctx.userId));

            return { success: true };
        }),

    getVerificationStatus: protectedProcedure.query(async ({ ctx }) => {
        const user = await ctx.db.query.users.findFirst({
            where: eq(users.id, ctx.userId),
            with: {
                documentVerifications: true,
            },
        });

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found",
            });
        }

        return {
            isVerified: user.isVerified,
            verificationStatus: user.documentVerificationsId?.verificationStatus,
            rejectionReason: user.documentVerificationsId?.rejectionReason,
        };
    }),
}); 