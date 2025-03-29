"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type SendFiatForm, sendFiatSchema } from "~/lib/validations/fiat";

interface SendFiatModalProps {
	isOpen: boolean;
	onClose: () => void;
}

type Step = "recipient" | "details" | "summary" | "2fa" | "status";

export function SendFiatModal({ isOpen, onClose }: SendFiatModalProps) {
	const [step, setStep] = useState<Step>("recipient");
	const [recipientType, setRecipientType] = useState<"saved" | "new">("saved");
	const [transactionData, setTransactionData] = useState<SendFiatForm | null>(
		null,
	);

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<SendFiatForm>({
		resolver: zodResolver(sendFiatSchema),
		defaultValues: {
			recipientType: "saved",
			currency: "NGN",
		},
	});

	useEffect(() => {
		if (!isOpen) {
			setStep("recipient");
			setTransactionData(null);
			setRecipientType("saved");
			reset({
				recipientType: "saved",
				currency: "NGN",
			});
		}
	}, [isOpen, reset]);

	useEffect(() => {
		setValue("recipientType", recipientType);
	}, [recipientType, setValue]);

	if (!isOpen) return null;

	const handleRecipientSelect = (type: "saved" | "new") => {
		setRecipientType(type);
		setStep("details");
	};

	const onSubmit = (data: SendFiatForm) => {
		console.log("Form data:", data);
		setTransactionData(data);
		setStep("summary");
	};

	const handle2FASubmit = () => {
		setStep("status");
	};

	const renderStep = () => {
		switch (step) {
			case "recipient":
				return (
					<>
						<div className="relative mb-6 flex items-center justify-between">
							<h2 className="w-full text-center font-semibold text-2xl">
								Choose Recipient
							</h2>
							<button
								type="button"
								onClick={onClose}
								className="absolute top-0 right-0 rounded-full p-2 hover:bg-gray-100"
							>
								<X className="h-6 w-6" />
							</button>
						</div>
						<div className="space-y-4">
							<p className="text-center text-gray-600">
								Select a saved beneficiary or enter a new account for this
								transaction.
							</p>
							<div className="space-y-2">
								<label className="flex cursor-pointer items-center gap-3 rounded-full bg-gray-50 p-4">
									<input
										type="radio"
										name="recipientType"
										value="saved"
										checked={recipientType === "saved"}
										onChange={() => setRecipientType("saved")}
										className="h-5 w-5 text-blue-600 focus:ring-blue-500"
									/>
									<span>Saved Beneficiary</span>
								</label>
								<label className="flex cursor-pointer items-center gap-3 rounded-full bg-gray-50 p-4">
									<input
										type="radio"
										name="recipientType"
										value="new"
										checked={recipientType === "new"}
										onChange={() => setRecipientType("new")}
										className="h-5 w-5 text-blue-600 focus:ring-blue-500"
									/>
									<span>New Account</span>
								</label>
							</div>
						</div>
						<button
							type="button"
							onClick={() => handleRecipientSelect(recipientType)}
							className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700"
						>
							Proceed
						</button>
					</>
				);

			case "details":
				return (
					<>
						<div className="relative mb-6 flex items-center justify-between">
							<h2 className="w-full text-center font-semibold text-2xl">
								Send Fiat
							</h2>
							<button
								type="button"
								onClick={onClose}
								className="absolute top-0 right-0 rounded-full p-2 hover:bg-gray-100"
							>
								<X className="h-6 w-6" />
							</button>
						</div>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div className="mb-4 flex items-start gap-2 rounded-lg bg-gray-50 p-3">
								<Info className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
								<p className="text-gray-600 text-sm">
									Transfer fiat securely and instantly to any bank. Ensure
									recipient details are correct before proceeding.
								</p>
							</div>

							<div className="space-y-6">
								<div>
									<label className="mb-1 block text-gray-600 text-sm">
										Currency
									</label>
									<div className="relative">
										<select
											{...register("currency")}
											className="w-full appearance-none rounded-lg bg-gray-50 py-3 pr-4 pl-12"
											defaultValue="NGN"
										>
											<option value="NGN">Nigerian Naira (NGN)</option>
										</select>
										<div className="-translate-y-1/2 absolute top-1/2 left-3">
											<Image
												src="/assets/flags/ng.svg"
												alt="NGN"
												width={24}
												height={24}
												className="rounded-full"
											/>
										</div>
										<div className="-translate-y-1/2 absolute top-1/2 right-3">
											<svg
												className="h-5 w-5 text-gray-400"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
									</div>
								</div>

								<div>
									<label className="mb-1 block text-gray-600 text-sm">
										Bank Name
									</label>
									<div className="relative">
										<select
											{...register("bankName")}
											className={`w-full appearance-none rounded-lg bg-gray-50 py-3 pr-4 pl-12 ${errors.bankName ? "border-red-500" : ""}`}
										>
											<option value="">Select a bank</option>
											<option value="moniepoint">Moniepoint</option>
											<option value="kuda">Kuda</option>
											<option value="gtbank">GTBank</option>
										</select>
										<div className="-translate-y-1/2 absolute top-1/2 left-3">
											<div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 font-medium text-sm text-white">
												M
											</div>
										</div>
										<div className="-translate-y-1/2 absolute top-1/2 right-3">
											<svg
												className="h-5 w-5 text-gray-400"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
									</div>
									{errors.bankName && (
										<p className="mt-1 text-red-500 text-sm">
											{errors.bankName.message}
										</p>
									)}
								</div>

								<div>
									<label className="mb-1 block text-gray-600 text-sm">
										Account Number
									</label>
									<input
										type="text"
										{...register("accountNumber")}
										className={`w-full rounded-lg bg-gray-50 px-4 py-3 ${errors.accountNumber ? "border-red-500" : ""}`}
										placeholder="Enter account number"
									/>
									{errors.accountNumber && (
										<p className="mt-1 text-red-500 text-sm">
											{errors.accountNumber.message}
										</p>
									)}
								</div>

								<div>
									<label className="mb-1 block text-gray-600 text-sm">
										Account Name
									</label>
									<input
										type="text"
										{...register("accountName")}
										className={`w-full rounded-lg bg-gray-50 px-4 py-3 ${errors.accountName ? "border-red-500" : ""}`}
										placeholder="Enter account name"
									/>
									{errors.accountName && (
										<p className="mt-1 text-red-500 text-sm">
											{errors.accountName.message}
										</p>
									)}
								</div>

								<div>
									<div className="mb-1 flex justify-between">
										<label className="text-gray-600 text-sm">Amount</label>
										<span className="text-gray-500 text-sm">
											Balance: N23,000
										</span>
									</div>
									<div className="relative">
										<input
											type="text"
											{...register("amount")}
											className={`w-full rounded-lg bg-gray-50 py-3 pr-16 pl-4 ${errors.amount ? "border-red-500" : ""}`}
											placeholder="Enter amount"
										/>
										<button
											type="button"
											onClick={() => setValue("amount", "23000")}
											className="-translate-y-1/2 absolute top-1/2 right-2 rounded bg-blue-600 px-3 py-1 text-sm text-white"
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
							</div>

							<button
								type="submit"
								className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700"
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
								onClick={onClose}
								className="absolute top-0 right-0 rounded-full p-2 hover:bg-gray-100"
							>
								<X className="h-6 w-6" />
							</button>
						</div>
						{transactionData && (
							<div className="space-y-6">
								<div className="space-y-4 rounded-xl bg-gray-50 p-4">
									<div className="flex justify-between">
										<span className="text-gray-600">Currency</span>
										<div className="flex items-center gap-2">
											<Image
												src="/assets/flags/ng.svg"
												alt="NGN"
												width={24}
												height={24}
												className="rounded-full"
											/>
											<span>NGN</span>
										</div>
									</div>

									<div className="flex justify-between">
										<span className="text-gray-600">Amount:</span>
										<span>N{transactionData.amount}</span>
									</div>

									<div className="flex justify-between">
										<span className="text-gray-600">Destination Account</span>
										<div className="text-right">
											<p>{transactionData.accountName}</p>
											<p className="text-gray-500 text-sm">
												{transactionData.accountNumber}
											</p>
											<p className="text-gray-500 text-sm">
												{transactionData.bankName}
											</p>
										</div>
									</div>

									<div className="flex justify-between">
										<span className="text-gray-600">Transaction fee:</span>
										<span>0.02 USDT</span>
									</div>
								</div>

								<button
									type="button"
									onClick={() => setStep("2fa")}
									className="w-full rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700"
								>
									Confirm
								</button>
							</div>
						)}
					</>
				);

			case "2fa":
				return (
					<>
						<div className="relative mb-6 flex items-center justify-between">
							<h2 className="w-full text-center font-semibold text-2xl">
								Two-Factor Authenticator
							</h2>
							<button
								type="button"
								onClick={onClose}
								className="absolute top-0 right-0 rounded-full p-2 hover:bg-gray-100"
							>
								<X className="h-6 w-6" />
							</button>
						</div>
						<div className="space-y-6">
							<p className="text-center text-gray-600">
								To complete your transaction, enter the 6-digit code from your
								authenticator app.
							</p>

							<div className="flex justify-between gap-2">
								{[...Array(6)].map((_, i) => (
									<input
										key={i}
										type="text"
										maxLength={1}
										className="h-12 w-12 rounded-lg border text-center"
									/>
								))}
							</div>

							<button
								type="button"
								onClick={handle2FASubmit}
								className="w-full rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700"
							>
								Confirm
							</button>
						</div>
					</>
				);

			case "status":
				return (
					<>
						<div className="relative mb-6 flex items-center justify-between">
							<h2 className="w-full text-center font-semibold text-2xl">
								Transaction Details
							</h2>
							<button
								type="button"
								onClick={onClose}
								className="absolute top-0 right-0 rounded-full p-2 hover:bg-gray-100"
							>
								<X className="h-6 w-6" />
							</button>
						</div>
						{transactionData && (
							<div className="space-y-6">
								<div className="mb-4 text-center">
									<h3 className="mb-2 font-bold text-2xl">
										N{transactionData.amount}
									</h3>
									<span className="rounded-full bg-orange-100 px-3 py-1 text-orange-600 text-sm">
										Pending
									</span>
								</div>

								<div className="space-y-4 rounded-xl bg-gray-50 p-4">
									<div className="flex justify-between">
										<span className="text-gray-600">Currency</span>
										<div className="flex items-center gap-2">
											<Image
												src="/assets/flags/ng.svg"
												alt="NGN"
												width={24}
												height={24}
												className="rounded-full"
											/>
											<span>NGN</span>
										</div>
									</div>

									<div className="flex justify-between">
										<span className="text-gray-600">Amount:</span>
										<span>N{transactionData.amount}</span>
									</div>

									<div className="flex justify-between">
										<span className="text-gray-600">Destination Account</span>
										<div className="text-right">
											<p>{transactionData.accountName}</p>
											<p className="text-gray-500 text-sm">
												{transactionData.accountNumber}
											</p>
											<p className="text-gray-500 text-sm">
												{transactionData.bankName}
											</p>
										</div>
									</div>

									<div className="flex justify-between">
										<span className="text-gray-600">Transaction fee:</span>
										<span>0.02 USDT</span>
									</div>
								</div>

								<div className="rounded-xl bg-blue-50 p-4">
									<p className="text-blue-600 text-sm">
										Your transaction is currently in progress. We'll notify you
										when it's completed.
									</p>
								</div>
							</div>
						)}
					</>
				);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
			<div className="mx-4 w-full max-w-md rounded-2xl bg-white">
				<div className="p-6">{renderStep()}</div>
			</div>
		</div>
	);
}
