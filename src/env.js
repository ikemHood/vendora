import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		DATABASE_URL: z.string().url(),
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		MAILTRAP_TOKEN: z.string(),
		MAILTRAP_SENDER_EMAIL: z.string().email(),
		MAILTRAP_SENDER_NAME: z.string(),
		JWT_SECRET: z.string(),
		APP_URL: z.string().url(),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		NEXT_PUBLIC_APP_URL: z.string().url(),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
		MAILTRAP_TOKEN: process.env.MAILTRAP_TOKEN,
		MAILTRAP_SENDER_EMAIL: process.env.MAILTRAP_SENDER_EMAIL,
		MAILTRAP_SENDER_NAME: process.env.MAILTRAP_SENDER_NAME,
		JWT_SECRET: process.env.JWT_SECRET,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
		APP_URL: process.env.APP_URL,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	/**
	 * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
	 * `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,
});
