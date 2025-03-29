"use client";

import { useAtom } from "jotai";
import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
	activeWalletTabAtom,
	receiveCryptoModalAtom,
	sendCryptoModalAtom,
	sendFiatModalAtom,
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
			<div className="mb-4 flex gap-4">
				<button
					type="button"
					className={`flex-1 rounded-xl px-4 py-3 text-left ${
						activeTab === "crypto"
							? "border border-gray-100 bg-white shadow-sm"
							: "bg-gray-50"
					}`}
					onClick={() => setActiveTab("crypto")}
				>
					<span className="font-medium text-sm">Crypto Wallet</span>
				</button>
				<button
					type="button"
					className={`flex-1 rounded-xl px-4 py-3 text-left ${
						activeTab === "fiat"
							? "border border-gray-100 bg-white shadow-sm"
							: "bg-gray-50"
					}`}
					onClick={() => setActiveTab("fiat")}
				>
					<span className="font-medium text-sm">Fiat Wallet</span>
				</button>
			</div>

			{/* Balance Card */}
			<div className="mb-4 rounded-xl bg-blue-600 p-4 text-white">
				<div className="mb-4 flex items-center justify-between">
					<span className="text-sm">
						Total {activeTab === "crypto" ? "Crypto" : "Fiat"} Balance
					</span>
					<button
						type="button"
						onClick={() => setIsBalanceVisible(!isBalanceVisible)}
					>
						{isBalanceVisible ? (
							<EyeOff className="h-5 w-5" />
						) : (
							<Eye className="h-5 w-5" />
						)}
					</button>
				</div>
				<div className="mb-4 flex items-center gap-2">
					<span className="font-semibold text-3xl">
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
						type="button"
						onClick={handleSend}
						className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/20 px-4 py-2 font-medium text-sm"
					>
						<ArrowUpRight className="h-4 w-4" />
						Send
					</button>
					<button
						type="button"
						onClick={handleReceive}
						className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/20 px-4 py-2 font-medium text-sm"
					>
						<ArrowDownLeft className="h-4 w-4" />
						Receive
					</button>
				</div>
			</div>
		</div>
	);
}
