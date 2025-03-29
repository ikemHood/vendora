"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Button } from "~/app/_components/Button";
import { Input } from "~/app/_components/Input";
import {
    type ForgotPasswordInput,
    forgotPasswordSchema,
} from "~/lib/validations/auth";
import { api } from "~/trpc/react";

const ForgotPasswordPage: NextPage = () => {
    const router = useRouter();
    const forgotPassword = api.auth.forgotPassword.useMutation({
        onSuccess: () => {
            toast.success("Password reset instructions sent to your email!");
            router.push("/login");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

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
        forgotPassword.mutate(data);
    };

    return (
        <div className="mt-12">
            <h2 className="font-bold text-3xl text-gray-900">Forgot Password</h2>
            <p className="mt-2 text-gray-600">
                Enter your email address and we'll send you instructions to reset your
                password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                <Input
                    {...register("email")}
                    placeholder="Email Address"
                    icon={<Mail size={20} />}
                    type="email"
                    error={errors.email?.message}
                />

                <Button type="submit" className="mt-6 w-full" isLoading={isSubmitting || forgotPassword.isPending}>
                    Send Reset Instructions
                </Button>

                <p className="mt-4 text-center text-gray-600 text-sm">
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
