"use client";

import Image from "next/image";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

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


export function Transaction({ transaction }: { transaction: Transaction }) {

    const renderTransactionIcon = (transaction: Transaction) => {
        if (transaction.type === "crypto") {
            return (
                <div className={`p-2 rounded-full ${transaction.direction === "incoming" ? "bg-green-100" : "bg-orange-100"
                    }`}>
                    {transaction.direction === "incoming" ? (
                        <ArrowDownLeft size={24} className="text-blue-600" />
                    ) : (
                        <ArrowUpRight size={24} className="text-blue-600" />
                    )}
                </div>
            );
        }

        return (
            <Image
                src={`/assets/banks/${transaction.bank}.svg`}
                alt={transaction.bank || ""}
                width={40}
                height={40}
                className="rounded-full"
            />
        );
    };

    const renderTransactionAmount = (transaction: Transaction) => {
        if (transaction.type === "crypto") {
            return (
                <div className="flex items-center gap-2">
                    <Image src={transaction.icon || ""} alt={transaction.name} width={16} height={16} />
                    <span>{transaction.amount}</span>
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                        {transaction.chain}
                    </span>
                </div>
            );
        }
        return transaction.amount;
    };

    const renderTransactionStatus = (status: Transaction["status"]) => {
        const statusStyles = {
            pending: "bg-orange-100 text-orange-600",
            completed: "bg-green-100 text-green-600",
            failed: "bg-red-100 text-red-600"
        };

        return (
            <span className={`${statusStyles[status]} text-xs px-2 py-0.5 rounded-full capitalize`}>
                {status}
            </span>
        );
    };

    return (
        <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm"
        >
            <div className="flex items-center gap-3">
                {renderTransactionIcon(transaction)}
                <div>
                    <h3 className="font-medium">{transaction.name}</h3>
                    <p className="text-sm text-gray-500">
                        {transaction.date} • {transaction.time}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-medium">{renderTransactionAmount(transaction)}</p>
                {renderTransactionStatus(transaction.status)}
            </div>
        </div>
    );
} 