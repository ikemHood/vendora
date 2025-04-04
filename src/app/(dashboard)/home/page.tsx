"use client";

import { Header } from "~/app/_components/Header";
import { Transaction as TransactionComponent } from "~/app/_components/Transaction";
import { WalletCard } from "~/app/_components/WalletCard";
import { LoadingSpinner } from "~/app/_components/LoadingSpinner";
import { api } from "~/trpc/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
        icon: "/assets/crypto/usdc.svg",
    },
    {
        id: "2",
        type: "fiat",
        name: "Chris Jones",
        amount: "N25,000",
        date: "Mar 24",
        time: "12:30 PM",
        status: "completed",
        bank: "kuda",
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
        icon: "/assets/crypto/usdc.svg",
    },
];

export default function HomePage() {
    const router = useRouter();
    const { data: user, isLoading, error } = api.auth.getCurrentUser.useQuery();

    useEffect(() => {
        if (error) {
            router.push("/login");
        }
    }, [error, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <div className="bg-white">
                <div className="px-4 py-6">
                    <Header user={user} />

                    <WalletCard />
                </div>
            </div>

            {/* Transactions List */}
            <div className="flex-1 p-4">
                <h2 className="mb-4 font-medium">All Transactions</h2>
                <div className="space-y-4">
                    {transactions.map((transaction) => (
                        <TransactionComponent
                            key={transaction.id}
                            transaction={transaction}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
