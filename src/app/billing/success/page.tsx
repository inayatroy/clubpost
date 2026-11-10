import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { PLANS, pool } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { Logo } from "../../components";

export const dynamic = "force-dynamic";

export default async function Success({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const user = await getUser();
  if (!user) redirect("/login?next=/dashboard");
  const { session_id } = await searchParams;

  let ok = false;
  let planName = "";
  let problem = "";
  try {
    if (!session_id) throw new Error("Missing checkout session.");
    const s = await stripe().checkout.sessions.retrieve(session_id);
    const plan = s.metadata?.plan === "business" ? "business" : "club_pro";
    if (s.metadata?.user_id !== String(user.id)) throw new Error("This checkout belongs to a different account.");
    if (s.status !== "complete") throw new Error("Payment hasn't gone through yet.");
    await pool().query("UPDATE users SET plan = $1, stripe_customer_id = $2 WHERE id = $3", [
      plan,
      typeof s.customer === "string" ? s.customer : s.customer?.id ?? null,
      user.id,
    ]);
    ok = true;
    planName = PLANS[plan].name;
  } catch (e) {
    problem = (e as Error).message;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-8"><Logo /></div>
      <div className="w-full max-w-md rounded-3xl border-2 border-ink bg-white p-8 shadow-[6px_6px_0_0_#ffc94a]">
        {ok ? (
          <>
            <p className="text-5xl">🎉</p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold">You&apos;re on {planName}!</h1>
            <p className="mt-2 text-ink/70">Unlimited posts, reel scripts and weekly plans are unlocked.</p>
          </>
        ) : (
          <>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">Hmm, that didn&apos;t finish</h1>
            <p className="mt-2 text-ink/70">{problem}</p>
          </>
        )}
        <Link href="/dashboard" className="mt-6 inline-block rounded-full bg-coral px-6 py-3 font-semibold text-white">
          Go to my dashboard
        </Link>
      </div>
    </main>
  );
}
