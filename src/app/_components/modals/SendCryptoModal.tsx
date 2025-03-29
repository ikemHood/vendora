"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useForm } from "react-hook-form";
import { useOtpInput } from "~/hooks/use-otp-input";
import {
	sendCryptoSchema,
	twoFactorSchema,
} from "~/lib/validations/transaction";
import type {
	SendCryptoInput,
	TwoFactorInput,
} from "~/lib/validations/transaction";

type Step = "details" | "summary" | "auth" | "final";

interface SendCryptoModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function SendCryptoModal({ isOpen, onClose }: SendCryptoModalProps) {
	const [step, setStep] = useState<Step>("details");
	const [transactionData, setTransactionData] =
		useState<SendCryptoInput | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SendCryptoInput>({
		resolver: zodResolver(sendCryptoSchema),
	});

	const {
		otp,
		inputRefs,
		handleChange: handleOtpChange,
		handleKeyDown: handleOtpKeyDown,
		handlePaste: handleOtpPaste,
		getValue: getOtpValue,
	} = useOtpInput(6);

	const {
		register: registerAuth,
		handleSubmit: handleAuthSubmit,
		formState: { errors: authErrors },
	} = useForm<TwoFactorInput>({
		resolver: zodResolver(twoFactorSchema),
	});

	const onSubmit = (data: SendCryptoInput) => {
		setTransactionData(data);
		setStep("summary");
	};

	const onAuthSubmit = (e: FormEvent) => {
		e.preventDefault();
		const code = getOtpValue();
		if (code.length === 6) {
			setStep("final");
		}
	};

	useEffect(() => {
		if (!isOpen) {
			setStep("details");
			setTransactionData(null);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const renderStep = () => {
		switch (step) {
			case "details":
				return (
					<>
						<div className="relative mb-4 flex items-center justify-between">
							<h2 className="w-full text-center font-semibold text-2xl">
								Send Crypto
							</h2>
							<button
								type="button"
								className="absolute top-0 right-0 rounded-full p-2 hover:bg-gray-100"
								onClick={onClose}
							>
								<X className="h-6 w-6" />
							</button>
						</div>
						<p className="mb-6 text-gray-600">
							Securely transfer crypto to any wallet. Double-check the recipient
							address before confirming your transaction.
						</p>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div>
								<label className="mb-1 block font-medium text-gray-700 text-sm">
									Asset
								</label>
								<select
									{...register("asset")}
									className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
								>
									<option value="">Select an asset</option>
									<option value="USDC">USDC</option>
								</select>
								{errors.asset && (
									<p className="mt-1 text-red-500 text-sm">
										{errors.asset.message}
									</p>
								)}
							</div>

							<div>
								<label className="mb-1 block font-medium text-gray-700 text-sm">
									Chain
								</label>
								<select
									{...register("chain")}
									className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
								>
									<option value="">Select a chain</option>
									<option value="Ethereum">Ethereum</option>
								</select>
								{errors.chain && (
									<p className="mt-1 text-red-500 text-sm">
										{errors.chain.message}
									</p>
								)}
							</div>

							<div>
								<label className="mb-1 block font-medium text-gray-700 text-sm">
									Amount
								</label>
								<div className="relative">
									<input
										type="text"
										{...register("amount")}
										placeholder="Input Amount"
										className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
									/>
									<button
										type="button"
										className="-translate-y-1/2 absolute top-1/2 right-3 rounded bg-blue-600 px-3 py-1 text-sm text-white"
									>
										Max
									</button>
								</div>
								{errors.amount && (
									<p className="mt-1 text-red-500 text-sm">
										{errors.amount.message}
									</p>
								)}
							</div>

							<div>
								<label className="mb-1 block font-medium text-gray-700 text-sm">
									Destination Wallet
								</label>
								<input
									type="text"
									{...register("destinationWallet")}
									placeholder="Input Wallet address"
									className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
								/>
								{errors.destinationWallet && (
									<p className="mt-1 text-red-500 text-sm">
										{errors.destinationWallet.message}
									</p>
								)}
							</div>

							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									{...register("saveBeneficiary")}
									className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<label className="text-gray-700 text-sm">
									Save this address as a beneficiary
								</label>
							</div>

							<button
								type="submit"
								className="w-full rounded-lg bg-blue-600 py-3 text-white transition-colors hover:bg-blue-700"
							>
								Proceed
							</button>
						</form>
					</>
				);

			case "summary":
				return (
					<>
						<div className="relative mb-6 flex items-center justify-between">
							<h2 className="w-full text-center font-semibold text-2xl">
								Transaction Summary
							</h2>
							<button
								type="button"
								className="absolute top-0 right-0"
								onClick={onClose}
							>
								<X className="h-6 w-6" />
							</button>
						</div>
						<div className="space-y-4">
							<div className="flex items-center justify-between py-2">
								<span className="text-gray-600">Asset:</span>
								<div className="flex items-center gap-2">
									<Image
										src="/assets/crypto/usdc.svg"
										alt="USDC"
										width={20}
										height={20}
									/>
									<span>{transactionData?.asset}</span>
								</div>
							</div>
							<div className="flex items-center justify-between py-2">
								<span className="text-gray-600">Chain:</span>
								<div className="flex items-center gap-2">
									<Image
										src="/assets/crypto/ethereum.svg"
										alt="Ethereum"
										width={20}
										height={20}
									/>
									<span>{transactionData?.chain}</span>
								</div>
							</div>
							<div className="flex items-center justify-between py-2">
								<span className="text-gray-600">Amount:</span>
								<span>{transactionData?.amount} USDT</span>
							</div>
							<div className="flex items-center justify-between py-2">
								<span className="text-gray-600">Destination Wallet:</span>
								<span className="font-mono">
									{transactionData?.destinationWallet}
								</span>
							</div>
							<div className="flex items-center justify-between py-2">
								<span className="text-gray-600">Transaction fee:</span>
								<span>0.02 USDT</span>
							</div>
							<button
								type="button"
								onClick={() => setStep("auth")}
								className="mt-4 w-full rounded-lg bg-blue-600 py-3 text-white transition-colors hover:bg-blue-700"
							>
								Confirm
							</button>
						</div>
					</>
				);

			case "auth":
				return (
					<>
						<div className="relative mb-6 flex items-center justify-between">
							<h2 className="w-full text-center font-semibold text-2xl">
								Two-Factor Authenticator
							</h2>
							<button
								type="button"
								className="absolute top-0 right-0 rounded-full p-2 hover:bg-gray-100"
								onClick={onClose}
							>
								<X className="h-6 w-6" />
							</button>
						</div>
						<p className="mb-6 text-center text-gray-600">
							To complete your transaction, enter the 6-digit code from your
							authenticator app.
						</p>
						<form onSubmit={onAuthSubmit} className="space-y-6">
							<div className="grid grid-cols-6 gap-2">
								{[...Array(6)].map((_, i) => (
									<input
										key={i}
										ref={(el) => {
											inputRefs.current[i] = el;
										}}
										type="text"
										maxLength={1}
										value={otp[i]}
										onChange={(e) => handleOtpChange(e.target.value, i)}
										onKeyDown={(e) => handleOtpKeyDown(e, i)}
										onPaste={(e) => handleOtpPaste(e, i)}
										className="aspect-square w-full rounded-lg border text-center font-medium text-2xl focus:border-transparent focus:ring-2 focus:ring-blue-500"
									/>
								))}
							</div>
							<button
								type="submit"
								className="w-full rounded-lg bg-blue-600 py-3 text-white transition-colors hover:bg-blue-700"
							>
								Confirm
							</button>
						</form>
					</>
				);

			case "final":
				return (
					<>
						<div className="relative mb-6 flex items-center justify-between">
							<h2 className="w-full text-center font-semibold text-2xl">
								Transaction Details
							</h2>
							<button
								type="button"
								className="absolute top-0 right-0 rounded-full p-2 hover:bg-gray-100"
								onClick={onClose}
							>
								<X className="h-6 w-6" />
							</button>
						</div>
						<div className="mb-6 text-center">
							<div className="mb-2 flex items-center justify-center gap-2">
								<Image
									src="/assets/crypto/usdc.svg"
									alt="USDC"
									width={24}
									height={24}
								/>
								<span className="font-semibold text-2xl">
									- {transactionData?.amount} USDC
								</span>
							</div>
							<span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-orange-700 text-sm">
								Pending
							</span>
						</div>
						<div className="space-y-4 rounded-lg bg-gray-50 p-4">
							<div className="flex items-center justify-between py-2">
								<span className="text-gray-600">Transaction ID</span>
								<div className="flex items-center gap-2">
									<span>Ven-121</span>
									<button
										type="button"
										className="rounded-full p-2 text-blue-600 hover:bg-gray-100"
									>
										<svg
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
											/>
										</svg>
									</button>
								</div>
							</div>
							<div className="flex items-center justify-between py-2">
								<span className="text-gray-600">Chain:</span>
								<div className="flex items-center gap-2">
									<Image
										src="/assets/crypto/ethereum.svg"
										alt="Ethereum"
										width={20}
										height={20}
									/>
									<span>{transactionData?.chain}</span>
								</div>
							</div>
							<div className="flex items-center justify-between py-2">
								<span className="text-gray-600">Destination Wallet</span>
								<span className="font-mono">
									{transactionData?.destinationWallet}
								</span>
							</div>
							<div className="flex items-center justify-between py-2">
								<span className="text-gray-600">Transaction fee:</span>
								<span>0.02 USDT</span>
							</div>
							<div className="flex items-center justify-between py-2">
								<span className="text-gray-600">Date</span>
								<span>Mar 24 • 12:30 PM</span>
							</div>
						</div>
						<div className="mt-6 flex items-start gap-3 rounded-lg bg-gray-50 p-4">
							<span className="text-gray-600">ℹ️</span>
							<p className="text-gray-600 text-sm">
								Your transaction is currently in progress. We'll notify you when
								it's completed.
							</p>
						</div>
					</>
				);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="mx-4 w-full max-w-md rounded-xl bg-white p-6">
				{renderStep()}
			</div>
		</div>
	);
}
