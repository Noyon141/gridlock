import * as schema from "@gridlock/db"; // Importing from our shared package!
import { neon } from "@neondatabase/serverless";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
  // We will add Social Providers (Google/Github) here later if needed
});
