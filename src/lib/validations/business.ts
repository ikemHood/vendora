import { z } from "zod";

const fileSchema = z.custom<File>((file) => file instanceof File, "File is required");

const fileDataSchema = z.object({
    name: z.string(),
    type: z.string(),
    data: z.string().refine((data) => data.startsWith('data:'), "Invalid file data"),
});

export const businessVerificationSchema = z.object({
    idDocument: z.union([
        fileSchema,
        fileDataSchema,
    ]).refine(
        (file) => ["application/pdf", "image/png", "image/jpeg", "image/jpg"].includes(file.type),
        "File must be PDF, PNG, JPEG or JPG",
    ),

    cacDocument: z.union([
        fileSchema,
        fileDataSchema,
    ]).refine(
        (file) => ["application/pdf", "image/png", "image/jpeg", "image/jpg"].includes(file.type),
        "File must be PDF, PNG, JPEG or JPG",
    ),
});

export type BusinessVerificationInput = z.infer<
    typeof businessVerificationSchema
>;
