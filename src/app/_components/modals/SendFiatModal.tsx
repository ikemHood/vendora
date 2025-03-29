"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendFiatSchema, type SendFiatForm } from "~/lib/validations/fiat";

interface SendFiatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = "recipient" | "details" | "summary" | "2fa" | "status";

export function SendFiatModal({ isOpen, onClose }: SendFiatModalProps) {
    const [step, setStep] = useState<Step>("recipient");
    const [recipientType, setRecipientType] = useState<"saved" | "new">("saved");
    const [transactionData, setTransactionData] = useState<SendFiatForm | null>(null);

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<SendFiatForm>({
        resolver: zodResolver(sendFiatSchema),
        defaultValues: {
            recipientType: "saved",
            currency: "NGN"
        }
    });

    useEffect(() => {
        if (!isOpen) {
            setStep("recipient");
            setTransactionData(null);
            setRecipientType("saved");
            reset({
                recipientType: "saved",
                currency: "NGN"
            });
        }
    }, [isOpen, reset]);

    useEffect(() => {
        setValue("recipientType", recipientType);
    }, [recipientType, setValue]);

    if (!isOpen) return null;

    const handleRecipientSelect = (type: "saved" | "new") => {
        setRecipientType(type);
        setStep("details");
    };

    const onSubmit = (data: SendFiatForm) => {
        console.log("Form data:", data);
        setTransactionData(data);
        setStep("summary");
    };

    const handle2FASubmit = () => {
        setStep("status");
    };

    const renderStep = () => {
        switch (step) {
            case "recipient":
                return (
                    <>
                        <div className="relative flex items-center justify-between mb-6">
                            <h2 className="text-2xl text-center w-full font-semibold">Choose Recipient</h2>
                            <button onClick={onClose} className="absolute right-0 top-0 hover:bg-gray-100 p-2 rounded-full">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-600 text-center">
                                Select a saved beneficiary or enter a new account for this transaction.
                            </p>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-full cursor-pointer">
                                    <input
                                        type="radio"
                                        name="recipientType"
                                        value="saved"
                                        checked={recipientType === "saved"}
                                        onChange={() => setRecipientType("saved")}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>Saved Beneficiary</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-full cursor-pointer">
                                    <input
                                        type="radio"
                                        name="recipientType"
                                        value="new"
                                        checked={recipientType === "new"}
                                        onChange={() => setRecipientType("new")}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>New Account</span>
                                </label>
                            </div>
                        </div>
                        <button
                            onClick={() => handleRecipientSelect(recipientType)}
                            className="w-full py-3 mt-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                        >
                            Proceed
                        </button>
                    </>
                );

            case "details":
                return (
                    <>
                        <div className="relative flex items-center justify-between mb-6">
                            <h2 className="text-2xl text-center w-full font-semibold">Send Fiat</h2>
                            <button onClick={onClose} className="absolute right-0 top-0 hover:bg-gray-100 p-2 rounded-full">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="bg-gray-50 p-3 rounded-lg mb-4 flex items-start gap-2">
                                <Info className="h-5 w-5 text-gray-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-600">
                                    Transfer fiat securely and instantly to any bank. Ensure recipient details are correct before proceeding.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Currency</label>
                                    <div className="relative">
                                        <select
                                            {...register("currency")}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg appearance-none"
                                            defaultValue="NGN"
                                        >
                                            <option value="NGN">Nigerian Naira (NGN)</option>
                                        </select>
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                            <Image
                                                src="/assets/flags/ng.svg"
                                                alt="NGN"
                                                width={24}
                                                height={24}
                                                className="rounded-full"
                                            />
                                        </div>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Bank Name</label>
                                    <div className="relative">
                                        <select
                                            {...register("bankName")}
                                            className={`w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg appearance-none ${errors.bankName ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">Select a bank</option>
                                            <option value="moniepoint">Moniepoint</option>
                                            <option value="kuda">Kuda</option>
                                            <option value="gtbank">GTBank</option>
                                        </select>
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                            <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                M
                                            </div>
                                        </div>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.bankName && (
                                        <p className="mt-1 text-sm text-red-500">{errors.bankName.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Account Number</label>
                                    <input
                                        type="text"
                                        {...register("accountNumber")}
                                        className={`w-full px-4 py-3 bg-gray-50 rounded-lg ${errors.accountNumber ? 'border-red-500' : ''}`}
                                        placeholder="Enter account number"
                                    />
                                    {errors.accountNumber && (
                                        <p className="mt-1 text-sm text-red-500">{errors.accountNumber.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Account Name</label>
                                    <input
                                        type="text"
                                        {...register("accountName")}
                                        className={`w-full px-4 py-3 bg-gray-50 rounded-lg ${errors.accountName ? 'border-red-500' : ''}`}
                                        placeholder="Enter account name"
                                    />
                                    {errors.accountName && (
                                        <p className="mt-1 text-sm text-red-500">{errors.accountName.message}</p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-sm text-gray-600">Amount</label>
                                        <span className="text-sm text-gray-500">Balance: N23,000</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            {...register("amount")}
                                            className={`w-full pl-4 pr-16 py-3 bg-gray-50 rounded-lg ${errors.amount ? 'border-red-500' : ''}`}
                                            placeholder="Enter amount"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setValue("amount", "23000")}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
                                        >
                                            Max
                                        </button>
                                    </div>
                                    {errors.amount && (
                                        <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 mt-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                            >
                                Proceed
                            </button>
                        </form>
                    </>
                );

            case "summary":
                return (
                    <>
                        <div className="relative flex items-center justify-between mb-6">
                            <h2 className="text-2xl text-center w-full font-semibold">Transaction Summary</h2>
                            <button onClick={onClose} className="absolute right-0 top-0 hover:bg-gray-100 p-2 rounded-full">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        {transactionData && (
                            <div className="space-y-6">
                                <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Currency</span>
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src="/assets/flags/ng.svg"
                                                alt="NGN"
                                                width={24}
                                                height={24}
                                                className="rounded-full"
                                            />
                                            <span>NGN</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Amount:</span>
                                        <span>N{transactionData.amount}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Destination Account</span>
                                        <div className="text-right">
                                            <p>{transactionData.accountName}</p>
                                            <p className="text-sm text-gray-500">{transactionData.accountNumber}</p>
                                            <p className="text-sm text-gray-500">{transactionData.bankName}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Transaction fee:</span>
                                        <span>0.02 USDT</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep("2fa")}
                                    className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                                >
                                    Confirm
                                </button>
                            </div>
                        )}
                    </>
                );

            case "2fa":
                return (
                    <>
                        <div className="relative flex items-center justify-between mb-6">
                            <h2 className="text-2xl text-center w-full font-semibold">Two-Factor Authenticator</h2>
                            <button onClick={onClose} className="absolute right-0 top-0 hover:bg-gray-100 p-2 rounded-full">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <p className="text-gray-600 text-center">
                                To complete your transaction, enter the 6-digit code from your authenticator app.
                            </p>

                            <div className="flex justify-between gap-2">
                                {[...Array(6)].map((_, i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        maxLength={1}
                                        className="w-12 h-12 text-center border rounded-lg"
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handle2FASubmit}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </>
                );

            case "status":
                return (
                    <>
                        <div className="relative flex items-center justify-between mb-6">
                            <h2 className="text-2xl text-center w-full font-semibold">Transaction Details</h2>
                            <button onClick={onClose} className="absolute right-0 top-0 hover:bg-gray-100 p-2 rounded-full">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        {transactionData && (
                            <div className="space-y-6">
                                <div className="text-center mb-4">
                                    <h3 className="text-2xl font-bold mb-2">N{transactionData.amount}</h3>
                                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm">
                                        Pending
                                    </span>
                                </div>

                                <div className="space-y-4 bg-gray-50 p-4 rounded-xl">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Currency</span>
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src="/assets/flags/ng.svg"
                                                alt="NGN"
                                                width={24}
                                                height={24}
                                                className="rounded-full"
                                            />
                                            <span>NGN</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Amount:</span>
                                        <span>N{transactionData.amount}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Destination Account</span>
                                        <div className="text-right">
                                            <p>{transactionData.accountName}</p>
                                            <p className="text-sm text-gray-500">{transactionData.accountNumber}</p>
                                            <p className="text-sm text-gray-500">{transactionData.bankName}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Transaction fee:</span>
                                        <span>0.02 USDT</span>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-xl">
                                    <p className="text-sm text-blue-600">
                                        Your transaction is currently in progress. We'll notify you when it's completed.
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md mx-4">
                <div className="p-6">
                    {renderStep()}
                </div>
            </div>
        </div>
    );
} 