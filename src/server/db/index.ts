import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

import { env } from "~/env";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
	client: postgres.Sql | undefined;
};

export const client =
	globalForDb.client ??
	postgres(env.DATABASE_URL, {
		max: 1,
		ssl: "require",
	});

if (env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
