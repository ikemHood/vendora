import { z } from "zod";

export const sendCryptoSchema = z.object({
    asset: z.string().min(1, "Please select an asset"),
    chain: z.string().min(1, "Please select a chain"),
    amount: z
        .string()
        .min(1, "Amount is required")
        .regex(/^\d*\.?\d*$/, "Please enter a valid number"),
    destinationWallet: z
        .string()
        .min(1, "Wallet address is required")
        .regex(/^0x[a-fA-F0-9]{40}$/, "Please enter a valid wallet address"),
    saveBeneficiary: z.boolean().default(false),
});

export const twoFactorSchema = z.object({
    code: z
        .string()
        .length(6, "Code must be 6 digits")
        .regex(/^\d+$/, "Code must contain only numbers"),
});

export type SendCryptoInput = z.infer<typeof sendCryptoSchema>;
export type TwoFactorInput = z.infer<typeof twoFactorSchema>; 