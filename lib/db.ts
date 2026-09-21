import postgres from "postgres";

// Server-only module. DATABASE_URL lives only in server environment variables
// (never in NEXT_PUBLIC_*), so it is never shipped to the browser.
const url = process.env.DATABASE_URL;

function missing(): never {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env.local locally or to your Vercel project environment variables."
  );
}

export const sql: postgres.Sql = url
  ? postgres(url, { ssl: "require", max: 5 })
  : (new Proxy(function () {}, { get: missing, apply: missing }) as unknown as postgres.Sql);

// Run once (e.g. from the sign-up action) to make sure the auth tables exist.
// In a larger app, use migrations instead.
let schemaReady: Promise<void> | null = null;
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS sessions (
          token TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
    })();
  }
  return schemaReady;
}
