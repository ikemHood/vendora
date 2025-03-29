"use client";

import { BottomNav } from "~/app/_components/BottomNav";
import { Providers } from "~/app/_components/Providers";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Providers>
            <div className="flex flex-col min-h-screen">
                {children}
                <BottomNav />
            </div>
        </Providers>
    );
} 