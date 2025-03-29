"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreVertical } from "lucide-react";

interface BeneficiaryProps {
    name: string;
    accountNumber: string;
    bank: string;
    onUpdate: () => void;
    onDelete: () => void;
}

export function Beneficiary({ name, accountNumber, bank, onUpdate, onDelete }: BeneficiaryProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="relative flex items-center justify-between p-4 border-b border-gray-100">
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
                    <p className="text-sm text-gray-500">
                        {accountNumber} • {bank}
                    </p>
                </div>
            </div>

            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-50 rounded-full"
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
                    <div className="absolute right-0 top-12 z-20 w-36 bg-white rounded-xl shadow-lg py-1 border border-gray-100">
                        <button
                            onClick={() => {
                                onUpdate();
                                setIsMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                        >
                            Update
                        </button>
                        <button
                            onClick={() => {
                                onDelete();
                                setIsMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                        >
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
} 