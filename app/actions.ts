"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { sql, ensureSchema } from "@/lib/db";
import { SESSION_COOKIE, GUEST_COOKIE, newSessionToken } from "@/lib/auth";

export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function createSession(userId: number, remember: boolean) {
  const token = newSessionToken();
  const days = remember ? 30 : 7;
  await sql`
    INSERT INTO sessions (token, user_id, expires_at)
    VALUES (${token}, ${userId}, now() + make_interval(days => ${days}))
  `;
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: days * 24 * 60 * 60,
  });
}

export async function signUp(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Enter a valid email address." };
  }
  if (password.length < 8) {
    return { status: "error", message: "Password must be at least 8 characters." };
  }

  await ensureSchema();

  const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
  if (existing.length > 0) {
    return { status: "error", message: "An account with this email already exists. Sign in instead." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const rows = await sql<{ id: number }[]>`
    INSERT INTO users (email, password_hash)
    VALUES (${email}, ${passwordHash})
    RETURNING id
  `;

  await createSession(rows[0].id, remember);
  redirect("/dashboard");
}

export async function signIn(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";

  if (!EMAIL_RE.test(email) || !password) {
    return { status: "error", message: "Enter your email and password." };
  }

  await ensureSchema();

  const rows = await sql<{ id: number; password_hash: string }[]>`
    SELECT id, password_hash FROM users WHERE email = ${email} LIMIT 1
  `;
  // Same message for unknown email and wrong password so account existence is not leaked.
  if (rows.length === 0 || !(await bcrypt.compare(password, rows[0].password_hash))) {
    return { status: "error", message: "Incorrect email or password." };
  }

  await createSession(rows[0].id, remember);
  redirect("/dashboard");
}

export async function continueAsGuest(): Promise<void> {
  const store = await cookies();
  store.set(GUEST_COOKIE, "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  });
  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await ensureSchema();
    await sql`DELETE FROM sessions WHERE token = ${token}`;
  }
  store.delete(SESSION_COOKIE);
  store.delete(GUEST_COOKIE);
  redirect("/");
}
