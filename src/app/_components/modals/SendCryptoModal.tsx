"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { X } from "lucide-react";
import { sendCryptoSchema, twoFactorSchema } from "~/lib/validations/transaction";
import type { SendCryptoInput, TwoFactorInput } from "~/lib/validations/transaction";
import { useOtpInput } from "~/hooks/use-otp-input";
import type { FormEvent } from "react";

type Step = "details" | "summary" | "auth" | "final";

interface SendCryptoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SendCryptoModal({ isOpen, onClose }: SendCryptoModalProps) {
    const [step, setStep] = useState<Step>("details");
    const [transactionData, setTransactionData] = useState<SendCryptoInput | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<SendCryptoInput>({
        resolver: zodResolver(sendCryptoSchema)
    });

    const {
        otp,
        inputRefs,
        handleChange: handleOtpChange,
        handleKeyDown: handleOtpKeyDown,
        handlePaste: handleOtpPaste,
        getValue: getOtpValue,
    } = useOtpInput(6);

    const { register: registerAuth, handleSubmit: handleAuthSubmit, formState: { errors: authErrors } } = useForm<TwoFactorInput>({
        resolver: zodResolver(twoFactorSchema)
    });

    const onSubmit = (data: SendCryptoInput) => {
        setTransactionData(data);
        setStep("summary");
    };

    const onAuthSubmit = (e: FormEvent) => {
        e.preventDefault();
        const code = getOtpValue();
        if (code.length === 6) {
            setStep("final");
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setStep("details");
            setTransactionData(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const renderStep = () => {
        switch (step) {
            case "details":
                return (
                    <>
                        <div className="relative flex items-center justify-between mb-4">
                            <h2 className="text-2xl text-center w-full font-semibold">Send Crypto</h2>
                            <button className="absolute right-0 top-0 hover:bg-gray-100 p-2 rounded-full" onClick={onClose}>
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Securely transfer crypto to any wallet. Double-check the recipient address before confirming your transaction.
                        </p>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Asset</label>
                                <select
                                    {...register("asset")}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select an asset</option>
                                    <option value="USDC">USDC</option>
                                </select>
                                {errors.asset && (
                                    <p className="text-red-500 text-sm mt-1">{errors.asset.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Chain</label>
                                <select
                                    {...register("chain")}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select a chain</option>
                                    <option value="Ethereum">Ethereum</option>
                                </select>
                                {errors.chain && (
                                    <p className="text-red-500 text-sm mt-1">{errors.chain.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        {...register("amount")}
                                        placeholder="Input Amount"
                                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Max
                                    </button>
                                </div>
                                {errors.amount && (
                                    <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Wallet</label>
                                <input
                                    type="text"
                                    {...register("destinationWallet")}
                                    placeholder="Input Wallet address"
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.destinationWallet && (
                                    <p className="text-red-500 text-sm mt-1">{errors.destinationWallet.message}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    {...register("saveBeneficiary")}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="text-sm text-gray-700">Save this address as a beneficiary</label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
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
                            <button className="absolute right-0 top-0" onClick={onClose}>
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-600">Asset:</span>
                                <div className="flex items-center gap-2">
                                    <Image src="/assets/crypto/usdc.svg" alt="USDC" width={20} height={20} />
                                    <span>{transactionData?.asset}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-600">Chain:</span>
                                <div className="flex items-center gap-2">
                                    <Image src="/assets/crypto/ethereum.svg" alt="Ethereum" width={20} height={20} />
                                    <span>{transactionData?.chain}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-600">Amount:</span>
                                <span>{transactionData?.amount} USDT</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-600">Destination Wallet:</span>
                                <span className="font-mono">{transactionData?.destinationWallet}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-600">Transaction fee:</span>
                                <span>0.02 USDT</span>
                            </div>
                            <button
                                onClick={() => setStep("auth")}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4"
                            >
                                Confirm
                            </button>
                        </div>
                    </>
                );

            case "auth":
                return (
                    <>
                        <div className="relative flex items-center justify-between mb-6">
                            <h2 className="text-2xl text-center w-full font-semibold">Two-Factor Authenticator</h2>
                            <button className="absolute right-0 top-0 hover:bg-gray-100 p-2 rounded-full" onClick={onClose}>
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <p className="text-gray-600 text-center mb-6">
                            To complete your transaction, enter the 6-digit code from your authenticator app.
                        </p>
                        <form onSubmit={onAuthSubmit} className="space-y-6">
                            <div className="grid grid-cols-6 gap-2">
                                {[...Array(6)].map((_, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => {
                                            inputRefs.current[i] = el;
                                        }}
                                        type="text"
                                        maxLength={1}
                                        value={otp[i]}
                                        onChange={(e) => handleOtpChange(e.target.value, i)}
                                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                                        onPaste={(e) => handleOtpPaste(e, i)}
                                        className="w-full aspect-square text-center text-2xl font-medium border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ))}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Confirm
                            </button>
                        </form>
                    </>
                );

            case "final":
                return (
                    <>
                        <div className="relative flex items-center justify-between mb-6">
                            <h2 className="text-2xl text-center w-full font-semibold">Transaction Details</h2>
                            <button className="absolute right-0 top-0 hover:bg-gray-100 p-2 rounded-full" onClick={onClose}>
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Image src="/assets/crypto/usdc.svg" alt="USDC" width={24} height={24} />
                                <span className="text-2xl font-semibold">
                                    - {transactionData?.amount} USDC
                                </span>
                            </div>
                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                                Pending
                            </span>
                        </div>
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-600">Transaction ID</span>
                                <div className="flex items-center gap-2">
                                    <span>Ven-121</span>
                                    <button className="text-blue-600 hover:bg-gray-100 p-2 rounded-full">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-600">Chain:</span>
                                <div className="flex items-center gap-2">
                                    <Image src="/assets/crypto/ethereum.svg" alt="Ethereum" width={20} height={20} />
                                    <span>{transactionData?.chain}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-600">Destination Wallet</span>
                                <span className="font-mono">{transactionData?.destinationWallet}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-600">Transaction fee:</span>
                                <span>0.02 USDT</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-600">Date</span>
                                <span>Mar 24 • 12:30 PM</span>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg flex items-start gap-3">
                            <span className="text-gray-600">ℹ️</span>
                            <p className="text-sm text-gray-600">
                                Your transaction is currently in progress. We'll notify you when it's completed.
                            </p>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-xl p-6 mx-4">
                {renderStep()}
            </div>
        </div>
    );
} 