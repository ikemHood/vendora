"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, X } from "lucide-react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const receiveCryptoSchema = z.object({
	asset: z.string().min(1, "Please select an asset"),
	chain: z.string().min(1, "Please select a chain"),
});

type ReceiveCryptoInput = z.infer<typeof receiveCryptoSchema>;
type Step = "select" | "details";

interface ReceiveCryptoModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ReceiveCryptoModal({
	isOpen,
	onClose,
}: ReceiveCryptoModalProps) {
	const [step, setStep] = useState<Step>("select");
	const [receiveData, setReceiveData] = useState<ReceiveCryptoInput | null>(
		null,
	);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ReceiveCryptoInput>({
		resolver: zodResolver(receiveCryptoSchema),
	});

	const onSubmit = (data: ReceiveCryptoInput) => {
		setReceiveData(data);
		setStep("details");
	};

	useEffect(() => {
		if (!isOpen) {
			setStep("select");
			setReceiveData(null);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const renderStep = () => {
		switch (step) {
			case "select":
				return (
					<>
						<div className="relative mb-6 flex items-center justify-between">
							<h2 className="w-full text-center font-semibold text-2xl">
								Receive Crypto
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
							To fund your crypto wallet, kindly select an asset and chain.
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
									<option value="ETH">ETH</option>
									<option value="BTC">BTC</option>
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
									<option value="POLYGON">Polygon</option>
									<option value="ETHEREUM">Ethereum</option>
								</select>
								{errors.chain && (
									<p className="mt-1 text-red-500 text-sm">
										{errors.chain.message}
									</p>
								)}
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

			case "details": {
				const walletAddress = "0x76704ghGH...WO2cqdFJKvf";
				return (
					<>
						<div className="relative mb-6 flex items-center justify-between">
							<h2 className="w-full text-center font-semibold text-2xl">
								Receive Crypto
							</h2>
							<button
								type="button"
								className="absolute top-0 right-0 rounded-full p-2 hover:bg-gray-100"
								onClick={onClose}
							>
								<X className="h-6 w-6" />
							</button>
						</div>
						<div className="mx-auto mb-6 flex w-fit items-center justify-center gap-2 rounded-full bg-blue-50 px-4 py-2">
							<Image
								src="/assets/crypto/usdc.svg"
								alt={receiveData?.asset || "Crypto Asset"}
								width={20}
								height={20}
							/>
							<span className="font-medium">{receiveData?.asset}</span>
							<span className="rounded-full bg-blue-200 px-2 py-0.5 text-gray-600 text-sm">
								{receiveData?.chain}
							</span>
						</div>
						<p className="mb-6 text-center text-gray-600">
							Scan the QR Code or copy the wallet address below to deposit
							crypto from another wallet.
						</p>
						<div className="mb-6 flex justify-center">
							<QRCodeSVG
								value={`${receiveData?.asset}:${receiveData?.chain}:0x1234...5678`}
								size={200}
								bgColor="#FFFFFF"
								fgColor="#000000"
								level="L"
								includeMargin={false}
								className="rounded-lg"
							/>
						</div>
						<div className="mb-6 flex items-center justify-between rounded-lg bg-gray-50 p-4">
							<span className="font-mono text-sm">{walletAddress}</span>
							<button
								type="button"
								className="rounded-full p-2 text-blue-600 hover:bg-gray-100"
							>
								<Copy className="h-4 w-4" />
							</button>
						</div>
						<div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
							<span>ℹ️</span>
							<p className="text-gray-600 text-sm">
								Send only {receiveData?.asset}-{receiveData?.chain} to this
								address. Sending any other coins may result in permanent loss.
							</p>
						</div>
					</>
				);
			}
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
