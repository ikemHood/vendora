"use client";

import Image from "next/image";
import { Bell } from 'lucide-react';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    user?: {
        id: string;
        name: string;
        email: string;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}

export function Header({
    title = "Good Morning",
    subtitle,
    user,
}: HeaderProps) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Image
                    src="/assets/avatar.svg"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <div>
                    <h1 className="font-semibold">{title}</h1>
                    <p className="text-gray-600">{subtitle ?? user?.name ?? "Welcome"}</p>
                </div>
            </div>
            <button type="button" className="p-2">
                <Bell className="w-6 h-6" />
            </button>
        </div>
    );
}
