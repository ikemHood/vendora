
export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800">
			<div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 text-white">
				<h1 className="text-4xl font-bold text-center sm:text-5xl">
					Welcome to Our Vendora
				</h1>

				<p className="text-xl text-center max-w-2xl text-gray-200">
					Experience our seamless crypto payment solution.
				</p>

				<div className="flex flex-col gap-4 w-full max-w-xs">
					<a
						href="/register"
						className="w-full px-8 py-4 text-lg font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors"
					>
						Start Demo
					</a>
				</div>
			</div>
		</main>
	);
}
