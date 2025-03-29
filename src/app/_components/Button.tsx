import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "~/lib/utils";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
	variant?: "primary" | "secondary" | "outline";
	size?: "sm" | "md" | "lg";
	isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = "primary",
			size = "md",
			isLoading = false,
			children,
			disabled,
			type = "button",
			...props
		},
		ref,
	) => {
		return (
			<button
				type={type}
				className={cn(
					"relative inline-flex items-center justify-center rounded-lg font-medium transition-colors",
					"disabled:cursor-not-allowed disabled:opacity-50",
					{
						primary:
							"bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
						secondary:
							"bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300",
						outline:
							"border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100",
					}[variant],
					{
						sm: "h-9 px-4 text-sm",
						md: "h-12 px-6 text-base",
						lg: "h-14 px-8 text-lg",
					}[size],
					className,
				)}
				ref={ref}
				disabled={disabled ?? isLoading}
				{...props}
			>
				{isLoading ? (
					<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
						<div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
					</div>
				) : null}
				<span className={cn(isLoading && "invisible")}>{children}</span>
			</button>
		);
	},
);

Button.displayName = "Button";

export { Button };
