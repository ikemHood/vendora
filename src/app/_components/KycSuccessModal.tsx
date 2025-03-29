"use client";

import Image from "next/image";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface KycSuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	onContinue: () => void;
}

export function KycSuccessModal({
	isOpen,
	onClose,
	onContinue,
}: KycSuccessModalProps) {
	return (
		<Modal isOpen={isOpen} onClose={onClose} className="text-center">
			<div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-blue-600">
				<Image src="/assets/check.svg" width={120} height={120} alt="Check" />
			</div>

			<h3 className="text-2xl text-gray-900">
				Congratulations! your KYC verification is complete.
			</h3>

			<Button
				type="button"
				onClick={() => {
					onClose();
					onContinue();
				}}
				className="mt-8 w-full"
			>
				Continue
			</Button>
		</Modal>
	);
}
