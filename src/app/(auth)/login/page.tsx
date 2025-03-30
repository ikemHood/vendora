"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Button } from "~/app/_components/Button";
import { Input } from "~/app/_components/Input";
import { type LoginInput, loginSchema } from "~/lib/validations/auth";
import { api } from "~/trpc/react";

const LoginPage: NextPage = () => {
    const router = useRouter();
    const login = api.auth.login.useMutation({
        onSuccess: (data) => {
            toast.success("Successfully logged in!");
            if (data.token) {
                localStorage.setItem("access_token", data.token);
            }
            if (data.requiresVerification) {
                router.push("/verify/business");
            } else {
                router.push("/home");
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

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
        login.mutate(data);
    };

    return (
        <div className="mt-12">
            <h2 className="font-bold text-3xl text-gray-900">Welcome Back</h2>
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
                        className="text-blue-600 text-sm hover:text-blue-700"
                    >
                        Forgot Password?
                    </Link>
                </div>

                <Button type="submit" className="mt-6 w-full" isLoading={isSubmitting || login.isPending}>
                    Sign In
                </Button>

                <p className="mt-4 text-center text-gray-600 text-sm">
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
