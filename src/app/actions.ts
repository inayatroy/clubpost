"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { ensureSchema, pool } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";

export type FormState = { error?: string; email?: string; name?: string };

function clean(v: FormDataEntryValue | null) {
  return String(v ?? "").trim();
}

export async function signup(_prev: FormState, form: FormData): Promise<FormState> {
  const name = clean(form.get("name"));
  const email = clean(form.get("email")).toLowerCase();
  const password = String(form.get("password") ?? "");
  const next = clean(form.get("next"));

  if (!name) return { error: "Please enter your name.", email, name };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email.", email, name };
  if (password.length < 8) return { error: "Password must be at least 8 characters.", email, name };

  let userId: number;
  try {
    await ensureSchema();
    const exists = await pool().query("SELECT 1 FROM users WHERE email = $1", [email]);
    if (exists.rowCount) return { error: "An account with that email already exists. Try logging in.", email, name };
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool().query(
      "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
      [email, hash, name]
    );
    userId = rows[0].id;
  } catch (e) {
    return { error: (e as Error).message || "Something went wrong. Please try again.", email, name };
  }
  await createSession(userId);
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  const email = clean(form.get("email")).toLowerCase();
  const password = String(form.get("password") ?? "");
  const next = clean(form.get("next"));

  let userId: number;
  try {
    await ensureSchema();
    const { rows } = await pool().query("SELECT id, password_hash FROM users WHERE email = $1", [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return { error: "Wrong email or password.", email };
    }
    userId = user.id;
  } catch (e) {
    return { error: (e as Error).message || "Something went wrong. Please try again.", email };
  }
  await createSession(userId);
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/");
}
