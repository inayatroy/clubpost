"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup, type FormState } from "./actions";

export default function AuthForm({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(mode === "login" ? login : signup, {});
  const input = "w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-3 outline-none focus:border-coral";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ""} />
      {mode === "signup" && (
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Your name</span>
          <input name="name" required defaultValue={state.name} className={input} placeholder="Inayat Roy" />
        </label>
      )}
      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Email</span>
        <input name="email" type="email" required defaultValue={state.email} className={input} placeholder="you@psu.edu" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Password</span>
        <input name="password" type="password" required minLength={mode === "signup" ? 8 : 1} className={input}
          placeholder={mode === "signup" ? "At least 8 characters" : ""} />
      </label>
      {state.error && <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm font-medium text-[#b33a1f]">{state.error}</p>}
      <button disabled={pending}
        className="w-full rounded-full bg-coral py-3 font-semibold text-white shadow-[4px_4px_0_0_#1d2340] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#1d2340] disabled:opacity-60">
        {pending ? "One sec…" : mode === "login" ? "Log in" : "Create my account"}
      </button>
      <p className="text-center text-sm text-ink/70">
        {mode === "login" ? (
          <>New here? <Link href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-ink underline">Create an account</Link></>
        ) : (
          <>Already have an account? <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-ink underline">Log in</Link></>
        )}
      </p>
    </form>
  );
}
