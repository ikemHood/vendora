"use client";
import { Eye, EyeOff } from "lucide-react";
import { type ComponentPropsWithoutRef, forwardRef, useState } from "react";
import { cn } from "~/lib/utils";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
	icon?: React.ReactNode;
	error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, type, icon, error, ...props }, ref) => {
		const [showPassword, setShowPassword] = useState(false);
		const isPassword = type === "password";

		return (
			<div className="relative w-full">
				<div className="relative">
					{icon && (
						<div className="-translate-y-1/2 absolute top-1/2 left-3 text-gray-400">
							{icon}
						</div>
					)}
					<input
						type={showPassword ? "text" : type}
						className={cn(
							"h-12 w-full rounded-lg bg-white px-4 py-2 text-gray-700 placeholder:text-gray-400",
							icon && "pl-10",
							isPassword && "pr-10",
							error && "border-red-500",
							className,
						)}
						ref={ref}
						{...props}
					/>
					{isPassword && (
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="-translate-y-1/2 absolute top-1/2 right-3 text-gray-400"
						>
							{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					)}
				</div>
				{error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
			</div>
		);
	},
);

Input.displayName = "Input";

export { Input };
