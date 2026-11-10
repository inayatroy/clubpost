import Link from "next/link";
import { logout } from "./actions";
import type { User } from "@/lib/db";

export function Logo() {
  return (
    <Link href="/" className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
      Club<span className="text-coral">Post</span>
    </Link>
  );
}

export function Nav({ user }: { user: User | null }) {
  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <Logo />
      <div className="flex items-center gap-5 text-sm font-medium">
        <Link href="/#how" className="hidden sm:inline hover:text-coral">How it works</Link>
        <Link href="/#pricing" className="hidden sm:inline hover:text-coral">Pricing</Link>
        {user ? (
          <>
            <Link href="/dashboard" className="rounded-full bg-ink px-4 py-2 text-cream hover:bg-coral">
              Dashboard
            </Link>
            <form action={logout}>
              <button className="hover:text-coral">Log out</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-coral">Log in</Link>
            <Link href="/signup" className="rounded-full bg-ink px-4 py-2 text-cream hover:bg-coral">
              Sign up free
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
