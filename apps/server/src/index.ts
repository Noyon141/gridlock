import { inventory } from "@gridlock/db";
import { serve } from "@hono/node-server";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth, db } from "./auth";
import { InventoryItem } from "./types/types";

const app = new Hono();

//CORS for React Native dev
app.use(
  "/*",
  cors({
    origin: "*", // Allow all for dev, restrict in prod
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Mount Better Auth Routes
// app.on(["POST", "GET"], "/api/auth/**", (c) => {
//   return auth.handler(c.req.raw);
// });

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
  return c.text("GridLock Backend Active 🟢");
});

app.post("/api/inventory/sync", async (c) => {
  console.log("=== DEBUG: Request Headers ===");
  c.req.raw.headers.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
  console.log("=== END Headers ===");

  let session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session?.user) {
    const cookieHeader = c.req.raw.headers.get("cookie");

    console.log("Cookie Header:", cookieHeader);

    const tokenMatch = cookieHeader?.match(
      /better-auth\.session_token=([^;]+)/,
    );

    const token = tokenMatch?.[1];

    console.log("Extracted Token:", token);

    if (token) {
      const sessionData = await db.query.session.findFirst({
        where: (session: any, { eq, and, gt }: any) =>
          and(eq(session.token, token), gt(session.expiresAt, new Date())),
        with: {
          user: true,
        },
      });

      console.log("Manual Session Data:", sessionData);

      if (sessionData?.user) {
        session = { user: sessionData.user, session: sessionData };
      }
    }
  }

  if (!session?.user) {
    console.log("Unauthorized: No valid session found after manual check.");

    return c.json({ error: "Unauthorized" }, 401);
  }

  const userId = await session?.user?.id;

  // Perform inventory sync logic here
  const body = await c.req.json();

  const items = body.items; // Array of items from client

  if (!items || items.length === 0) {
    console.log("No items to sync for user:", userId);
    return c.json({ message: "No items to sync", success: true, count: 0 });
  }

  const records = items.map((item: InventoryItem) => ({
    id: item.id,
    name: item.name,
    sku: item.sku,
    quantity: item.quantity,
    userId: userId,
    updatedAt: new Date(),
    synced: true,
  }));

  try {
    console.log(`Syncing ${records.length} items for user:`, userId);
    // Upsert items into the database
    await db
      .insert(inventory)
      .values(records)
      .onConflictDoUpdate({
        target: inventory.id,
        set: {
          name: sql`excluded.name`,
          sku: sql`excluded.sku`,
          quantity: sql`excluded.quantity`,
          updatedAt: sql`excluded.updated_at`,
        },
      });

    return c.json({
      message: "Sync successful",
      success: true,
      count: records.length,
    });
  } catch (error) {
    console.error("Error during inventory sync for user:", userId, error);

    return c.json({ error: "Sync failed", details: error }, 500);
  }
});
const port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
