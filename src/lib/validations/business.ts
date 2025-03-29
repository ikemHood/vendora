import { z } from "zod";

export const businessVerificationSchema = z.object({
	idDocument: z
		.custom<File>()
		.refine((file) => file instanceof File, "ID document is required")
		.refine(
			(file) => ["application/pdf", "image/png"].includes(file.type),
			"File must be PDF or PNG",
		)
		.refine(
			(file) => file.size <= 5 * 1024 * 1024,
			"File must be less than 5MB",
		),

	cacDocument: z
		.custom<File>()
		.refine((file) => file instanceof File, "CAC document is required")
		.refine(
			(file) => ["application/pdf", "image/png"].includes(file.type),
			"File must be PDF or PNG",
		)
		.refine(
			(file) => file.size <= 5 * 1024 * 1024,
			"File must be less than 5MB",
		),
});

export type BusinessVerificationInput = z.infer<
	typeof businessVerificationSchema
>;
