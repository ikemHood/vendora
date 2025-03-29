"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, CircleDollarSign, Settings } from "lucide-react";
import { cn } from "~/lib/utils";

const navItems = [
    {
        label: "Home",
        href: "/home",
        icon: Home,
    },
    {
        label: "Wallet",
        href: "/wallet",
        icon: Wallet,
    },
    {
        label: "Transaction",
        href: "/transactions",
        icon: CircleDollarSign,
    },
    {
        label: "Settings",
        href: "/settings",
        icon: Settings,
    },
] as const;

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white">
            <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2",
                                isActive ? "text-blue-600" : "text-gray-600",
                            )}
                        >
                            <item.icon size={24} />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
} 