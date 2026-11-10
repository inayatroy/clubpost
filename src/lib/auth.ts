import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { createHash } from "crypto";
import { ensureSchema, pool, type User } from "./db";

const COOKIE = "cp_session";

function secretKey() {
  // Uses SESSION_SECRET if set; otherwise derives a key from the (secret) database URL.
  const base = process.env.SESSION_SECRET || process.env.DATABASE_URL || process.env.POSTGRES_URL || "dev-secret";
  return new Uint8Array(createHash("sha256").update("clubpost-session:" + base).digest());
}

export async function createSession(userId: number) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey());
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getUser(): Promise<User | null> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secretKey());
    const uid = Number(payload.uid);
    if (!uid) return null;
    await ensureSchema();
    const { rows } = await pool().query(
      "SELECT id, email, name, plan, club_name, club_voice FROM users WHERE id = $1",
      [uid]
    );
    return (rows[0] as User) ?? null;
  } catch {
    return null;
  }
}
