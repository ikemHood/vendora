"use client";

import { format, isWithinInterval, parseISO } from "date-fns";
import { Filter } from "lucide-react";
import { useState } from "react";
import { BottomNav } from "~/app/_components/BottomNav";
import { DateRangePicker } from "~/app/_components/DateRangePicker";
import { Header } from "~/app/_components/Header";
import { Transaction } from "~/app/_components/Transaction";

interface Transaction {
	id: string;
	type: "crypto" | "fiat";
	name: string;
	amount: string;
	date: string;
	time: string;
	status: "pending" | "completed" | "failed";
	bank?: string;
	chain?: string;
	direction?: "incoming" | "outgoing";
	timestamp: string;
	icon?: string;
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
		timestamp: "2024-03-24T12:30:00Z",
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
		timestamp: "2024-03-24T12:30:00Z",
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
		timestamp: "2024-03-24T12:30:00Z",
		icon: "/assets/crypto/usdc.svg",
	},
];

interface DateRange {
	startDate: Date | null;
	endDate: Date | null;
}

export default function TransactionsPage() {
	const [activeTab, setActiveTab] = useState<"crypto" | "fiat">("crypto");
	const [dateRange, setDateRange] = useState<DateRange>({
		startDate: null,
		endDate: null,
	});
	const [isFilterActive, setIsFilterActive] = useState(false);

	const filteredTransactions = transactions.filter((tx) => {
		let passes = tx.type === activeTab;

		if (isFilterActive && dateRange.startDate && dateRange.endDate) {
			const txDate = parseISO(tx.timestamp);
			passes =
				passes &&
				isWithinInterval(txDate, {
					start: dateRange.startDate,
					end: dateRange.endDate,
				});
		}

		return passes;
	});

	const handleDateRangeChange = (range: DateRange) => {
		setDateRange(range);
		setIsFilterActive(true);
	};

	return (
		<div className="flex min-h-screen flex-col bg-gray-50">
			<div className="bg-white px-4 py-6">
				<h1 className="mb-6 font-semibold text-2xl">Transactions</h1>

				{/* Tab Switcher */}
				<div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1">
					<button
						type="button"
						className={`rounded-lg px-4 py-3 font-medium text-sm transition-colors ${
							activeTab === "crypto" ? "bg-white shadow-sm" : "text-gray-600"
						}`}
						onClick={() => setActiveTab("crypto")}
					>
						Crypto Transactions
					</button>
					<button
						type="button"
						className={`rounded-lg px-4 py-3 font-medium text-sm transition-colors ${
							activeTab === "fiat" ? "bg-white shadow-sm" : "text-gray-600"
						}`}
						onClick={() => setActiveTab("fiat")}
					>
						Fiat Transactions
					</button>
				</div>

				{/* Filters */}
				<div className="flex gap-2">
					<div className="flex-1">
						<DateRangePicker onChange={handleDateRangeChange} />
					</div>
					<button
						type="button"
						className={`rounded-lg p-2 transition-colors ${
							isFilterActive ? "bg-blue-600 text-white" : "bg-gray-100"
						}`}
						onClick={() => setIsFilterActive(!isFilterActive)}
					>
						<Filter className="h-4 w-4" />
					</button>
				</div>
			</div>

			{/* Transactions List */}
			<div className="flex-1 p-4">
				<div className="space-y-4">
					{filteredTransactions.map((transaction) => (
						<Transaction key={transaction.id} transaction={transaction} />
					))}
				</div>
			</div>

			<BottomNav />
		</div>
	);
}
