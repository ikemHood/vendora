"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Beneficiary } from "~/app/_components/Beneficiary";

interface SavedBeneficiary {
	id: string;
	name: string;
	accountNumber: string;
	bank: string;
}

// Mock data - replace with actual data from your API
const mockBeneficiaries: SavedBeneficiary[] = [
	{
		id: "1",
		name: "POS Transfer - ACHALUGO",
		accountNumber: "0346278961",
		bank: "KUDA",
	},
	{
		id: "2",
		name: "POS Transfer - ACHALUGO",
		accountNumber: "0346278961",
		bank: "KUDA",
	},
	{
		id: "3",
		name: "POS Transfer - ACHALUGO",
		accountNumber: "0346278961",
		bank: "KUDA",
	},
];

export default function BeneficiariesPage() {
	const router = useRouter();
	const [beneficiaries, setBeneficiaries] = useState(mockBeneficiaries);

	const handleUpdate = (beneficiary: SavedBeneficiary) => {
		// Implement update logic
		console.log("Update beneficiary:", beneficiary);
	};

	const handleDelete = (beneficiaryId: string) => {
		setBeneficiaries((prev) => prev.filter((b) => b.id !== beneficiaryId));
	};

	return (
		<div className="flex min-h-screen flex-col bg-white">
			{/* Header */}
			<div className="sticky top-0 border-gray-100 border-b bg-white px-4 py-6">
				<div className="mb-6 flex items-center gap-4">
					<button
						type="button"
						onClick={() => router.back()}
						className="-ml-2 rounded-full p-2 hover:bg-gray-50"
					>
						<ArrowLeft className="h-6 w-6" />
					</button>
					<h1 className="font-semibold text-2xl">Saved Beneficiary</h1>
				</div>
			</div>

			{/* Beneficiaries List */}
			<div className="flex-1">
				{beneficiaries.map((beneficiary) => (
					<Beneficiary
						key={beneficiary.id}
						name={beneficiary.name}
						accountNumber={beneficiary.accountNumber}
						bank={beneficiary.bank}
						onUpdate={() => handleUpdate(beneficiary)}
						onDelete={() => handleDelete(beneficiary.id)}
					/>
				))}
			</div>
		</div>
	);
}
