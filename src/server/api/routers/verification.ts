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
                // with: {
                //     documentVerification: true,
                // },
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found",
                });
            }
            console.log("user", user);
            if (user.isVerified) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User is already verified",
                });
            }

            // Check if user has pending verification
            const pendingVerification = await ctx.db.query.documentVerifications.findFirst({
                where: eq(documentVerifications.userId, ctx.userId),
            });

            if (pendingVerification && pendingVerification.verificationStatus === "pending") {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "You already have a pending verification",
                });
            }

            // Generate unique file names
            const timestamp = Date.now();
            const idDocPath = `verifications/${ctx.userId}/id_doc_${timestamp}.${input.idDocument.name.split('.').pop()}`;
            const cacDocPath = `verifications/${ctx.userId}/cac_doc_${timestamp}.${input.cacDocument.name.split('.').pop()}`;

            // Create verification record with base64 data
            const [verification] = await ctx.db
                .insert(documentVerifications)
                .values({
                    userId: ctx.userId,
                    idDoc: idDocPath,
                    cacDoc: cacDocPath,
                    idDocData: 'data' in input.idDocument ? input.idDocument.data : null,
                    cacDocData: 'data' in input.cacDocument ? input.cacDocument.data : null,
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
                    documentVerification: verification.id,
                })
                .where(eq(users.id, ctx.userId));

            return {
                success: true,
                message: "Verification documents submitted successfully",
                verificationId: verification.id
            };
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
            verificationStatus: user.documentVerification?.verificationStatus,
            rejectionReason: user.documentVerification?.rejectionReason,
        };
    }),
}); 