"use client";
import { type NextPage } from "next";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Input } from "~/app/_components/Input";
import { Button } from "~/app/_components/Button";
import { loginSchema, type LoginInput } from "~/lib/validations/auth";

const LoginPage: NextPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            // TODO: Implement API call here
            console.log("Form submitted:", data);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">
                Enter your credentials to access your account.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                <Input
                    {...register("email")}
                    placeholder="Email Address"
                    icon={<Mail size={20} />}
                    type="email"
                    error={errors.email?.message}
                />

                <Input
                    {...register("password")}
                    placeholder="Password"
                    icon={<Lock size={20} />}
                    type="password"
                    error={errors.password?.message}
                />

                <div className="flex justify-end">
                    <Link
                        href="/password/forgot"
                        className="text-sm text-blue-600 hover:text-blue-700"
                    >
                        Forgot Password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    className="mt-6 w-full"
                    isLoading={isSubmitting}
                >
                    Sign In
                </Button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        href="/create-account"
                        className="font-medium text-blue-600 hover:text-blue-700"
                    >
                        Create Account
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage; 