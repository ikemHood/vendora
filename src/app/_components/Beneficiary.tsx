"use client";

import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface BeneficiaryProps {
	name: string;
	accountNumber: string;
	bank: string;
	onUpdate: () => void;
	onDelete: () => void;
}

export function Beneficiary({
	name,
	accountNumber,
	bank,
	onUpdate,
	onDelete,
}: BeneficiaryProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<div className="relative flex items-center justify-between border-gray-100 border-b p-4">
			<div className="flex items-center gap-3">
				<Image
					src={`/assets/banks/${bank.toLowerCase()}.svg`}
					alt={bank}
					width={40}
					height={40}
					className="rounded-full"
				/>
				<div>
					<h3 className="font-medium text-gray-900">{name}</h3>
					<p className="text-gray-500 text-sm">
						{accountNumber} • {bank}
					</p>
				</div>
			</div>

			<button
				type="button"
				onClick={() => setIsMenuOpen(!isMenuOpen)}
				className="rounded-full p-2 hover:bg-gray-50"
			>
				<MoreVertical className="h-5 w-5 text-gray-400" />
			</button>

			{isMenuOpen && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsMenuOpen(false)}
					/>

					{/* Dropdown Menu */}
					<div className="absolute top-12 right-0 z-20 w-36 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
						<button
							type="button"
							onClick={() => {
								onUpdate();
								setIsMenuOpen(false);
							}}
							className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
						>
							Update
						</button>
						<button
							type="button"
							onClick={() => {
								onDelete();
								setIsMenuOpen(false);
							}}
							className="w-full px-4 py-2 text-left text-red-600 text-sm hover:bg-gray-50"
						>
							Delete
						</button>
					</div>
				</>
			)}
		</div>
	);
}
