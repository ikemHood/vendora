"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";

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
				<div
					className={`rounded-full p-2 ${
						transaction.direction === "incoming"
							? "bg-green-100"
							: "bg-orange-100"
					}`}
				>
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
					<Image
						src={transaction.icon || ""}
						alt={transaction.name}
						width={16}
						height={16}
					/>
					<span>{transaction.amount}</span>
					<span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-600 text-xs">
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
			failed: "bg-red-100 text-red-600",
		};

		return (
			<span
				className={`${statusStyles[status]} rounded-full px-2 py-0.5 text-xs capitalize`}
			>
				{status}
			</span>
		);
	};

	return (
		<div
			key={transaction.id}
			className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
		>
			<div className="flex items-center gap-3">
				{renderTransactionIcon(transaction)}
				<div>
					<h3 className="font-medium">{transaction.name}</h3>
					<p className="text-gray-500 text-sm">
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
