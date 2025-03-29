"use client";

import { useAtom } from "jotai";
import { Header } from "~/app/_components/Header";
import { WalletCard } from "~/app/_components/WalletCard";
import { sendCryptoModalAtom, receiveCryptoModalAtom } from "~/app/_store/atoms";
import { Transaction } from "~/app/_components/Transaction";

interface Transaction {
    id: string;
    type: "crypto" | "fiat";
    name: string;
    amount: string;
    date: string;
    time: string;
    status: "pending" | "completed" | "failed";
    icon?: string;
    bank?: string;
    chain?: string;
    direction?: "incoming" | "outgoing";
}

const transactions: Transaction[] = [
    {
        id: "1",
        type: "crypto",
        name: "Ven-121",
        amount: "100 USDC",
        date: "Mar 24",
        time: "12:30 PM",
        status: "pending",
        chain: "POLYGON",
        direction: "incoming",
        icon: "/assets/crypto/usdc.svg"
    },
    {
        id: "2",
        type: "fiat",
        name: "Chris Jones",
        amount: "N25,000",
        date: "Mar 24",
        time: "12:30 PM",
        status: "completed",
        bank: "kuda"
    },
    {
        id: "3",
        type: "crypto",
        name: "Ven-121",
        amount: "100 USDC",
        date: "Mar 24",
        time: "12:30 PM",
        status: "pending",
        chain: "POLYGON",
        direction: "outgoing",
        icon: "/assets/crypto/usdc.svg"
    }
];

export default function HomePage() {
    const [, setIsSendModalOpen] = useAtom(sendCryptoModalAtom);
    const [, setIsReceiveModalOpen] = useAtom(receiveCryptoModalAtom);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="bg-white">
                <div className="px-4 py-6">
                    <Header />

                    <WalletCard />
                </div>
            </div>

            {/* Transactions List */}
            <div className="flex-1 p-4">
                <h2 className="font-medium mb-4">All Transactions</h2>
                <div className="space-y-4">
                    {transactions.map((transaction) => (
                        <Transaction key={transaction.id} transaction={transaction} />
                    ))}
                </div>
            </div>
        </div>
    );
} 