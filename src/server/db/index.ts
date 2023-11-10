import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

import { env } from "~/env.mjs";
import * as schema from "./schema";

// eslint-disable-next-line
const sqlite = new Database(env.DATABASE_URL);
export const db = drizzle(sqlite, { schema });
