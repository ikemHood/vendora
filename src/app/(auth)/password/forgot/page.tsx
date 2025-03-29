"use client";

import { type NextPage } from "next";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Input } from "~/app/_components/Input";
import { Button } from "~/app/_components/Button";
import { forgotPasswordSchema, type ForgotPasswordInput } from "~/lib/validations/auth";

const ForgotPasswordPage: NextPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ForgotPasswordInput) => {
        try {
            // TODO: Implement API call here
            console.log("Form submitted:", data);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
            <p className="mt-2 text-gray-600">
                Enter your email address and we'll send you instructions to reset your password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                <Input
                    {...register("email")}
                    placeholder="Email Address"
                    icon={<Mail size={20} />}
                    type="email"
                    error={errors.email?.message}
                />

                <Button
                    type="submit"
                    className="mt-6 w-full"
                    isLoading={isSubmitting}
                >
                    Send Reset Instructions
                </Button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-blue-600 hover:text-blue-700"
                    >
                        Sign In
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPasswordPage; 