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
			<div className="flex min-h-screen flex-col">
				{children}
				<BottomNav />
			</div>
		</Providers>
	);
}
