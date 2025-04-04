export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="mx-auto max-w-md">
				<h1 className="mb-2 font-bold text-4xl text-gray-900">Vendora</h1>
				{children}
			</div>
		</div>
	);
}
