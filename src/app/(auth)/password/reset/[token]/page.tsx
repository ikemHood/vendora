"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "~/app/_components/Button";
import { Input } from "~/app/_components/Input";
import {
	type ResetPasswordInput,
	resetPasswordSchema,
} from "~/lib/validations/auth";

function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ResetPasswordInput>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: ResetPasswordInput) => {
		try {
			// TODO: Implement API call here with the token
			console.log("Form submitted:", { ...data, token: (await params).token });
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	};

	return (
		<div className="mt-12">
			<h2 className="font-bold text-3xl text-gray-900">Reset Password</h2>
			<p className="mt-2 text-gray-600">Enter your new password below.</p>

			<form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
				<Input
					{...register("password")}
					placeholder="New Password"
					icon={<Lock size={20} />}
					type="password"
					error={errors.password?.message}
				/>

				<Input
					{...register("confirmPassword")}
					placeholder="Confirm New Password"
					icon={<Lock size={20} />}
					type="password"
					error={errors.confirmPassword?.message}
				/>

				<Button type="submit" className="mt-6 w-full" isLoading={isSubmitting}>
					Reset Password
				</Button>
			</form>
		</div>
	);
}

export default ResetPasswordPage;
