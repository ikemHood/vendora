import { z } from "zod";

export const sendFiatSchema = z.object({
    recipientType: z.enum(["saved", "new"]),
    currency: z.string(),
    bankName: z.string(),
    accountNumber: z.string().min(10).max(10),
    accountName: z.string(),
    amount: z.string(),
});

export type SendFiatForm = z.infer<typeof sendFiatSchema>; 