import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import AuthForm from "../AuthForm";
import { Logo } from "../components";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getUser()) redirect(next?.startsWith("/") ? next : "/dashboard");
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="mb-8"><Logo /></div>
      <div className="w-full max-w-md rounded-3xl border-2 border-ink bg-white p-8 shadow-[6px_6px_0_0_#ffc94a]">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">Welcome back 👋</h1>
        <p className="mb-6 mt-1 text-ink/70">Log in to write your next post.</p>
        <AuthForm mode="login" next={next} />
      </div>
    </main>
  );
}
