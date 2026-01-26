import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";
dotenv.config({ path: "../../apps/server/.env" }); //env from server

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
