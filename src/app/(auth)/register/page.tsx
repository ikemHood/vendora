"use client";

import { type NextPage } from "next";
import { Building2, Mail, Phone, User, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Input } from "~/app/_components/Input";
import { Button } from "~/app/_components/Button";
import { createAccountSchema, type CreateAccountInput } from "~/lib/validations/auth";

const CreateAccountPage: NextPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateAccountInput>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {
            businessName: "",
            fullName: "",
            phoneNumber: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: CreateAccountInput) => {
        try {
            // TODO: Implement API call here
            console.log("Form submitted:", data);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900">Create your Account</h2>
            <p className="mt-2 text-gray-600">
                Enter your personal information to get a Vendora account.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                <Input
                    {...register("businessName")}
                    placeholder="Business Name"
                    icon={<Building2 size={20} />}
                    error={errors.businessName?.message}
                />

                <Input
                    {...register("fullName")}
                    placeholder="Full Name"
                    icon={<User size={20} />}
                    error={errors.fullName?.message}
                />

                <Input
                    {...register("phoneNumber")}
                    placeholder="Phone Number"
                    icon={<Phone size={20} />}
                    type="tel"
                    error={errors.phoneNumber?.message}
                />

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

                <Button
                    type="submit"
                    className="mt-6 w-full"
                    isLoading={isSubmitting}
                >
                    Create Account
                </Button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
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

export default CreateAccountPage; 