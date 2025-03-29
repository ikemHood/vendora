"use client";

import { Plus, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Header } from "~/app/_components/Header";
import { WalletCard } from "~/app/_components/WalletCard";

const assets = [
    {
        id: "solana",
        name: "Solana",
        symbol: "SOL",
        balance: "0",
        value: "0.00",
        icon: "/assets/crypto/solana.svg",
    },
    {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        balance: "0",
        value: "0.00",
        icon: "/assets/crypto/ethereum.svg",
    },
    {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        balance: "0",
        value: "0.00",
        icon: "/assets/crypto/bitcoin.svg",
    },
    {
        id: "polygon",
        name: "Polygon",
        symbol: "POL",
        balance: "0",
        value: "0.00",
        icon: "/assets/crypto/polygon.svg",
    },
];

export default function WalletPage() {
    const [activeTab, setActiveTab] = useState<"crypto" | "fiat">("crypto");

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <div className="bg-white">
                <div className="px-4 py-6">
                    <Header />

                    <WalletCard />

                    {/* Search and Add */}
                    <div className="mb-4 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search assets"
                                className="w-full rounded-lg bg-gray-100 py-2 pr-4 pl-10 text-sm"
                            />
                        </div>
                        <button type="button" className="rounded-lg bg-gray-100 p-2">
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Asset List */}
            <div className="flex-1 p-4">
                <h2 className="mb-4 font-medium">Assets</h2>
                <div className="space-y-4">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
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
                                    <p className="text-gray-500 text-sm">
                                        {asset.balance} {asset.symbol}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">${asset.value}</p>
                                <p className="text-gray-500 text-sm">${asset.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
