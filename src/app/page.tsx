export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800">
			<div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 text-white">
				<h1 className="text-center font-bold text-4xl sm:text-5xl">
					Welcome to Our Vendora
				</h1>

				<p className="max-w-2xl text-center text-gray-200 text-xl">
					Experience our seamless crypto payment solution.
				</p>

				<div className="flex w-full max-w-xs flex-col gap-4">
					<a
						href="/register"
						className="w-full rounded-lg bg-blue-500 px-8 py-4 text-center font-medium text-lg text-white transition-colors hover:bg-blue-400"
					>
						Start Demo
					</a>
				</div>
			</div>
		</main>
	);
}
