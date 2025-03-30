"use client";

import { Header } from "~/app/_components/Header";
import { Button } from "~/app/_components/Button";
import { LoadingSpinner } from "~/app/_components/LoadingSpinner";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
    const router = useRouter();
    const { data: user, isLoading, error } = api.auth.getCurrentUser.useQuery();
    const logout = api.auth.logout.useMutation({
        onSuccess: () => {
            router.push("/login");
        },
    });

    useEffect(() => {
        if (error) {
            router.push("/login");
        }
    }, [error, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <div className="bg-white">
                <div className="px-4 py-6">
                    <Header user={user} />
                </div>
            </div>

            <div className="flex-1 p-6">
                <div className="mx-auto max-w-2xl">
                    <h2 className="mb-6 text-2xl font-semibold text-gray-900">Settings</h2>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Profile Information</h3>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <div className="mt-1 text-sm text-gray-900">{user?.name}</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <div className="mt-1 text-sm text-gray-900">{user?.email}</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Account Status</label>
                                        <div className="mt-1 text-sm text-gray-900">
                                            {user?.isVerified ? "Verified" : "Unverified"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <Button
                                    onClick={() => logout.mutate()}
                                    className="w-full bg-red-600 hover:bg-red-700"
                                    isLoading={logout.isPending}
                                >
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 