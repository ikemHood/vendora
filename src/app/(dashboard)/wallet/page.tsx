"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import { Plus, Search } from "lucide-react";
import { Header } from "~/app/_components/Header";
import { WalletCard } from "~/app/_components/WalletCard";
import { sendCryptoModalAtom, receiveCryptoModalAtom } from "~/app/_store/atoms";

const assets = [
    {
        id: "solana",
        name: "Solana",
        symbol: "SOL",
        balance: "0",
        value: "0.00",
        icon: "/assets/crypto/solana.svg"
    },
    {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        balance: "0",
        value: "0.00",
        icon: "/assets/crypto/ethereum.svg"
    },
    {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        balance: "0",
        value: "0.00",
        icon: "/assets/crypto/bitcoin.svg"
    },
    {
        id: "polygon",
        name: "Polygon",
        symbol: "POL",
        balance: "0",
        value: "0.00",
        icon: "/assets/crypto/polygon.svg"
    }
];

export default function WalletPage() {
    const [activeTab, setActiveTab] = useState<"crypto" | "fiat">("crypto");
    const [, setIsSendModalOpen] = useAtom(sendCryptoModalAtom);
    const [, setIsReceiveModalOpen] = useAtom(receiveCryptoModalAtom);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="bg-white">
                <div className="px-4 py-6">
                    <Header />

                    <WalletCard />

                    {/* Search and Add */}
                    <div className="flex gap-2 mb-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search assets"
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-sm"
                            />
                        </div>
                        <button className="p-2 rounded-lg bg-gray-100">
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Asset List */}
            <div className="flex-1 p-4">
                <h2 className="font-medium mb-4">Assets</h2>
                <div className="space-y-4">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <Image
                                    src={asset.icon}
                                    alt={asset.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <div>
                                    <h3 className="font-medium">{asset.name}</h3>
                                    <p className="text-sm text-gray-500">{asset.balance} {asset.symbol}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">${asset.value}</p>
                                <p className="text-sm text-gray-500">${asset.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 