import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { openDatabaseSync } from "expo-sqlite";
import migrations from "../../drizzle/migrations";
import * as schema from "./schema";

const EXPO_DB_NAME = "gridlock.db";

const expoDb = openDatabaseSync(EXPO_DB_NAME);

export const db = drizzle(expoDb, { schema });

export const useMigrationHelper = () => {
  return useMigrations(db, migrations);
};
