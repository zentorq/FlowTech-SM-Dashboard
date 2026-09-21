import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { sql, ensureSchema } from "./db";

export const SESSION_COOKIE = "ft_session";
export const GUEST_COOKIE = "ft_guest";

export type SessionUser = {
  id: number;
  email: string;
};

export type AuthState =
  | { kind: "user"; user: SessionUser }
  | { kind: "guest" }
  | { kind: "none" };

export function newSessionToken(): string {
  return crypto.randomUUID().replaceAll("-", "") + crypto.randomUUID().replaceAll("-", "");
}

// Reads the current request's auth state. Cached per request.
export const getAuthState = cache(async (): Promise<AuthState> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await ensureSchema();
    const rows = await sql<SessionUser[]>`
      SELECT u.id, u.email
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token = ${token} AND s.expires_at > now()
      LIMIT 1
    `;
    if (rows.length > 0) return { kind: "user", user: rows[0] };
  }
  if (store.get(GUEST_COOKIE)?.value === "1") {
    return { kind: "guest" };
  }
  return { kind: "none" };
});
