"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ArrowDownLeft, Eye, EyeOff } from "lucide-react";
import { useAtom } from "jotai";
import {
    activeWalletTabAtom,
    sendCryptoModalAtom,
    sendFiatModalAtom,
    receiveCryptoModalAtom
} from "../_store/atoms";

export function WalletCard() {
    const [activeTab, setActiveTab] = useAtom(activeWalletTabAtom);
    const [, setSendCryptoModal] = useAtom(sendCryptoModalAtom);
    const [, setSendFiatModal] = useAtom(sendFiatModalAtom);
    const [, setReceiveCryptoModal] = useAtom(receiveCryptoModalAtom);
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);

    const handleSend = () => {
        if (activeTab === "crypto") {
            setSendCryptoModal(true);
        } else {
            setSendFiatModal(true);
        }
    };

    const handleReceive = () => {
        if (activeTab === "crypto") {
            setReceiveCryptoModal(true);
        }
        // TODO: Implement fiat receive flow if needed
    };

    return (
        <div>
            {/* Wallet Type Selector */}
            <div className="flex gap-4 mb-4">
                <button
                    className={`flex-1 py-3 px-4 rounded-xl text-left ${activeTab === "crypto"
                        ? "bg-white shadow-sm border border-gray-100"
                        : "bg-gray-50"
                        }`}
                    onClick={() => setActiveTab("crypto")}
                >
                    <span className="text-sm font-medium">Crypto Wallet</span>
                </button>
                <button
                    className={`flex-1 py-3 px-4 rounded-xl text-left ${activeTab === "fiat"
                        ? "bg-white shadow-sm border border-gray-100"
                        : "bg-gray-50"
                        }`}
                    onClick={() => setActiveTab("fiat")}
                >
                    <span className="text-sm font-medium">Fiat Wallet</span>
                </button>
            </div>

            {/* Balance Card */}
            <div className="bg-blue-600 rounded-xl p-4 text-white mb-4">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm">Total {activeTab === "crypto" ? "Crypto" : "Fiat"} Balance</span>
                    <button onClick={() => setIsBalanceVisible(!isBalanceVisible)}>
                        {isBalanceVisible ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-3xl font-semibold">
                        {isBalanceVisible ? "$9,500.00" : "****"}
                    </span>
                    <Image
                        src="/assets/crypto/usdc.svg"
                        alt="USDC"
                        width={24}
                        height={24}
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSend}
                        className="flex items-center justify-center gap-2 bg-white/20 rounded-lg py-2 px-4 text-sm font-medium flex-1"
                    >
                        <ArrowUpRight className="h-4 w-4" />
                        Send
                    </button>
                    <button
                        onClick={handleReceive}
                        className="flex items-center justify-center gap-2 bg-white/20 rounded-lg py-2 px-4 text-sm font-medium flex-1"
                    >
                        <ArrowDownLeft className="h-4 w-4" />
                        Receive
                    </button>
                </div>
            </div>
        </div>
    );
} 