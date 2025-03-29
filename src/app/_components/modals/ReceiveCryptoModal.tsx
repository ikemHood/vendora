"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { X, Copy } from "lucide-react";
import { z } from "zod";
import { QRCodeSVG } from 'qrcode.react';

const receiveCryptoSchema = z.object({
    asset: z.string().min(1, "Please select an asset"),
    chain: z.string().min(1, "Please select a chain"),
});

type ReceiveCryptoInput = z.infer<typeof receiveCryptoSchema>;
type Step = "select" | "details";

interface ReceiveCryptoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ReceiveCryptoModal({ isOpen, onClose }: ReceiveCryptoModalProps) {
    const [step, setStep] = useState<Step>("select");
    const [receiveData, setReceiveData] = useState<ReceiveCryptoInput | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<ReceiveCryptoInput>({
        resolver: zodResolver(receiveCryptoSchema)
    });

    const onSubmit = (data: ReceiveCryptoInput) => {
        setReceiveData(data);
        setStep("details");
    };

    useEffect(() => {
        if (!isOpen) {
            setStep("select");
            setReceiveData(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const renderStep = () => {
        switch (step) {
            case "select":
                return (
                    <>
                        <div className="relative flex items-center justify-between mb-6">
                            <h2 className="text-2xl text-center w-full font-semibold">Receive Crypto</h2>
                            <button className="absolute right-0 top-0 hover:bg-gray-100 p-2 rounded-full" onClick={onClose}>
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <p className="text-gray-600 text-center mb-6">
                            To fund your crypto wallet, kindly select an asset and chain.
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
                                    <option value="ETH">ETH</option>
                                    <option value="BTC">BTC</option>
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
                                    <option value="POLYGON">Polygon</option>
                                    <option value="ETHEREUM">Ethereum</option>
                                </select>
                                {errors.chain && (
                                    <p className="text-red-500 text-sm mt-1">{errors.chain.message}</p>
                                )}
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

            case "details":
                const walletAddress = "0x76704ghGH...WO2cqdFJKvf";
                return (
                    <>
                        <div className="relative flex items-center justify-between mb-6">
                            <h2 className="text-2xl text-center w-full font-semibold">Receive Crypto</h2>
                            <button className="absolute right-0 top-0 hover:bg-gray-100 p-2 rounded-full" onClick={onClose}>
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="flex mx-auto items-center w-fit justify-center gap-2 bg-blue-50 rounded-full px-4 py-2 mb-6">
                            <Image
                                src="/assets/crypto/usdc.svg"
                                alt={receiveData?.asset || "Crypto Asset"}
                                width={20}
                                height={20}
                            />
                            <span className="font-medium">{receiveData?.asset}</span>
                            <span className="bg-blue-200 text-gray-600 px-2 py-0.5 rounded-full text-sm">
                                {receiveData?.chain}
                            </span>
                        </div>
                        <p className="text-gray-600 text-center mb-6">
                            Scan the QR Code or copy the wallet address below to deposit crypto from another wallet.
                        </p>
                        <div className="flex justify-center mb-6">
                            <QRCodeSVG
                                value={`${receiveData?.asset}:${receiveData?.chain}:0x1234...5678`}
                                size={200}
                                bgColor="#FFFFFF"
                                fgColor="#000000"
                                level="L"
                                includeMargin={false}
                                className="rounded-lg"
                            />
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between mb-6">
                            <span className="font-mono text-sm">{walletAddress}</span>
                            <button className="text-blue-600 hover:bg-gray-100 p-2 rounded-full">
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                            <span>ℹ️</span>
                            <p className="text-sm text-gray-600">
                                Send only {receiveData?.asset}-{receiveData?.chain} to this address.
                                Sending any other coins may result in permanent loss.
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