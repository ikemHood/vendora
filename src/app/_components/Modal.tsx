"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/25 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Modal */}
			<div
				className={cn(
					"relative z-50 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg",
					className,
				)}
			>
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
				>
					<X size={24} />
				</button>
				{children}
			</div>
		</div>
	);
}
