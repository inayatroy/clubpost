import { Pool } from "pg";
import bcrypt from "bcryptjs";

// One shared connection pool per server instance.
const g = globalThis as unknown as { _pool?: Pool; _schema?: Promise<void> };

export const DEMO_EMAIL = "demo@demo.com";
export const DEMO_PASSWORD = "password123!";

function connectionString() {
  // Vercel's Neon integration sets DATABASE_URL (some setups use POSTGRES_URL).
  const raw = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
  if (!raw) {
    throw new Error(
      "No database connected. In Vercel, open your project → Storage → connect a Neon database, then redeploy."
    );
  }
  // Remove SSL query params; SSL is configured on the pool below.
  const url = new URL(raw);
  url.searchParams.delete("sslmode");
  url.searchParams.delete("channel_binding");
  return url.toString();
}

export function pool() {
  if (!g._pool) {
    const cs = connectionString();
    const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(cs);
    g._pool = new Pool({ connectionString: cs, ssl: isLocal ? false : true, max: 3 });
  }
  return g._pool;
}

// Creates the tables (if missing) and makes sure the demo account exists with full paid access.
export function ensureSchema() {
  if (!g._schema) {
    g._schema = (async () => {
      const db = pool();
      await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name TEXT,
          plan TEXT NOT NULL DEFAULT 'free',
          club_name TEXT,
          club_voice TEXT,
          stripe_customer_id TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS generations (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          event_details TEXT NOT NULL,
          vibe TEXT NOT NULL,
          output JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);
      const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
      await db.query(
        `INSERT INTO users (email, password_hash, name, plan, club_name, club_voice)
         VALUES ($1, $2, 'Demo User', 'club_pro', 'PSU Entrepreneurs', 'Upbeat, a little witty, emoji-friendly but not cringe')
         ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, plan = 'club_pro'`,
        [DEMO_EMAIL, hash]
      );
    })().catch((err) => {
      g._schema = undefined; // retry on the next request
      throw err;
    });
  }
  return g._schema;
}

export type User = {
  id: number;
  email: string;
  name: string | null;
  plan: "free" | "club_pro" | "business";
  club_name: string | null;
  club_voice: string | null;
};

export const PLANS = {
  club_pro: { name: "Club Pro", price: 12, cents: 1200 },
  business: { name: "Business", price: 29, cents: 2900 },
} as const;

export const FREE_MONTHLY_LIMIT = 3;

export function isPaid(u: Pick<User, "plan">) {
  return u.plan === "club_pro" || u.plan === "business";
}
