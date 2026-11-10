import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { FREE_MONTHLY_LIMIT, PLANS, isPaid, pool } from "@/lib/db";
import type { PostKit } from "@/lib/ai";
import { Nav } from "../components";
import Generator, { KitView } from "./Generator";

export const dynamic = "force-dynamic";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ canceled?: string; error?: string; checkout?: string }> }) {
  const user = await getUser();
  if (!user) redirect("/login?next=/dashboard");
  const { canceled, error, checkout } = await searchParams;
  const checkoutPlan = checkout === "business" ? "business" : checkout === "club_pro" ? "club_pro" : null;

  const db = pool();
  const [{ rows: usage }, { rows: history }] = await Promise.all([
    db.query(
      "SELECT COUNT(*)::int AS n FROM generations WHERE user_id = $1 AND created_at >= date_trunc('month', now())",
      [user.id]
    ),
    db.query(
      "SELECT id, event_details, vibe, output, created_at FROM generations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10",
      [user.id]
    ),
  ]);
  const used = usage[0].n as number;
  const paid = isPaid(user);
  const planName = paid ? PLANS[user.plan as keyof typeof PLANS].name : "Free";

  return (
    <main className="min-h-screen pb-20">
      <Nav user={user} />
      <section className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#b33a1f]">Hi {user.name?.split(" ")[0] || "there"} 👋</p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold">What are we posting?</h1>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm ring-1 ring-ink/10">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${paid ? "bg-mint" : "bg-sun"}`}>{planName} plan</span>
            {paid ? (
              <span>Unlimited posts</span>
            ) : (
              <>
                <span>{Math.min(used, FREE_MONTHLY_LIMIT)} / {FREE_MONTHLY_LIMIT} free posts used this month</span>
                <a href="/api/checkout?plan=club_pro" className="font-semibold text-[#b33a1f] underline">Upgrade</a>
              </>
            )}
          </div>
        </div>

        {checkoutPlan && user.plan !== checkoutPlan && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-sun/40 px-5 py-4">
            <span className="font-medium">Your account is ready! Finish upgrading to {PLANS[checkoutPlan].name}.</span>
            <a href={`/api/checkout?plan=${checkoutPlan}`} className="rounded-full bg-coral px-5 py-2 font-semibold text-white">Continue to checkout →</a>
          </div>
        )}
        {canceled && <p className="mb-6 rounded-xl bg-sun/40 px-4 py-3 text-sm">Checkout canceled — no charge was made.</p>}
        {error && <p className="mb-6 rounded-xl bg-coral/10 px-4 py-3 text-sm text-[#b33a1f]">{error}</p>}

        <Generator defaultClub={user.club_name ?? ""} defaultVoice={user.club_voice ?? ""} />

        {history.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl font-bold">Your recent posts</h2>
            <div className="space-y-3">
              {history.map((h) => (
                <details key={h.id} className="rounded-2xl bg-white p-5 ring-1 ring-ink/10">
                  <summary className="cursor-pointer list-none">
                    <span className="mr-2 rounded-full bg-cream px-2 py-0.5 text-xs font-semibold">{h.vibe}</span>
                    <span className="font-medium">{String(h.event_details).slice(0, 90)}{String(h.event_details).length > 90 ? "…" : ""}</span>
                    <span className="ml-2 text-xs text-ink/50">{new Date(h.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </summary>
                  <div className="mt-4"><KitView kit={h.output as PostKit} /></div>
                </details>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
