import Link from "next/link";
import { getUser } from "@/lib/auth";
import { Nav } from "./components";

export const dynamic = "force-dynamic";

const steps = [
  {
    n: "1",
    title: "Drop in the details",
    body: "Event name, date, location, the free pizza situation. Bullet points are fine — messy is fine.",
  },
  {
    n: "2",
    title: "Pick your vibe",
    body: "Hype, chill, professional, or 'we are a niche club and proud of it'. ClubPost learns your voice.",
  },
  {
    n: "3",
    title: "Post and go",
    body: "Get a caption, hashtags, a 30-second reel script, and story text. Copy, paste, done.",
  },
];

const features = [
  { emoji: "✍️", title: "Captions that sound like you", body: "Not like a corporate account. Not like a robot. Like your club." },
  { emoji: "🎬", title: "Reel scripts, shot by shot", body: "Hook, scenes, on-screen text, and a call to action — ready to film between classes." },
  { emoji: "📅", title: "A week of posts in one go", body: "Teaser, reminder, day-of, and recap posts planned around your event date." },
  { emoji: "🔁", title: "Hand-offs without the chaos", body: "New social chair? Your club's voice and past posts stay in the account." },
];

export default async function Home() {
  const user = await getUser();
  return (
    <main className="min-h-screen">
      <Nav user={user} />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-10 md:grid-cols-2">
        <div>
          <p className="mb-4 inline-block rounded-full bg-mint px-3 py-1 text-sm font-medium">
            Built for student orgs 🎓 · by Inayat Roy
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.05] md:text-6xl">
            Your club&apos;s social media, done before your coffee cools.
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink/75">
            Paste your event details. ClubPost writes the Instagram caption, the reel script,
            and a week of posts — in your club&apos;s voice.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={user ? "/dashboard" : "/signup"} className="rounded-full bg-coral px-6 py-3 font-semibold text-white shadow-[4px_4px_0_0_#1d2340] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#1d2340]">
              {user ? "Go to my dashboard" : "Try it free"}
            </Link>
            <a href="#how" className="rounded-full border-2 border-ink px-6 py-3 font-semibold hover:bg-ink hover:text-cream">
              See how it works
            </a>
          </div>
        </div>

        {/* Demo card */}
        <div className="relative">
          <div className="absolute -right-3 -top-3 h-full w-full rounded-3xl bg-sun" aria-hidden />
          <div className="relative rounded-3xl border-2 border-ink bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">You type</p>
            <p className="mt-2 rounded-xl bg-cream p-3 text-sm">
              Entrepreneurship club pitch night, Thurs 7pm, Business Building 120, free Insomnia cookies,
              anyone can pitch an idea in 60 sec
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-ink/50">ClubPost writes</p>
            <div className="mt-2 space-y-3 text-sm">
              <p className="rounded-xl border border-ink/10 p-3">
                <span className="font-semibold">Caption:</span> Got an idea living rent-free in your head? 🧠
                Give it 60 seconds on stage this Thursday. Pitch Night · 7pm · BB 120. Cookies are on us 🍪
              </p>
              <p className="rounded-xl border border-ink/10 p-3">
                <span className="font-semibold">Reel hook:</span> &ldquo;POV: you finally say your startup idea out loud&rdquo;
              </p>
              <p className="rounded-xl border border-ink/10 p-3 text-ink/60">
                + story text, hashtags, and 3 more posts for the week…
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-ink py-20 text-cream">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-[family-name:var(--font-display)] text-4xl font-bold">Three steps. Zero blank-caption panic.</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-cream/20 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-coral font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-cream/70">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-[family-name:var(--font-display)] text-4xl font-bold">Everything your social chair wishes they had</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl bg-white p-6 ring-1 ring-ink/10">
              <span className="text-3xl">{f.emoji}</span>
              <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-ink/70">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-center font-[family-name:var(--font-display)] text-4xl font-bold">Cheaper than one round of flyers</h2>
        <p className="mt-3 text-center text-ink/70">Start free. Upgrade when your club is hooked.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="flex flex-col rounded-3xl border-2 border-ink/15 bg-white p-8">
            <h3 className="text-lg font-semibold">Free</h3>
            <p className="mt-2 text-4xl font-bold">$0</p>
            <ul className="mt-6 flex-1 space-y-2 text-ink/75">
              <li>✓ 3 posts per month</li>
              <li>✓ Caption, hashtags, reel script</li>
              <li>✓ Week-of-posts plan</li>
            </ul>
            <Link href={user ? "/dashboard" : "/signup"} className="mt-8 block rounded-full border-2 border-ink py-3 text-center font-semibold hover:bg-ink hover:text-cream">
              {user ? "Go to dashboard" : "Start free"}
            </Link>
          </div>
          <div className="relative flex flex-col rounded-3xl border-2 border-ink bg-white p-8 shadow-[6px_6px_0_0_#ff6b4a]">
            <span className="absolute -top-3 right-6 rounded-full bg-sun px-3 py-1 text-xs font-bold">Most clubs pick this</span>
            <h3 className="text-lg font-semibold">Club Pro</h3>
            <p className="mt-2 text-4xl font-bold">$12<span className="text-base font-normal text-ink/60">/month</span></p>
            <ul className="mt-6 flex-1 space-y-2 text-ink/75">
              <li>✓ Unlimited posts</li>
              <li>✓ Saved club voice</li>
              <li>✓ Full post history for the next officer</li>
              <li>✓ For student organizations</li>
            </ul>
            <a href="/api/checkout?plan=club_pro" className="mt-8 block rounded-full bg-coral py-3 text-center font-semibold text-white hover:bg-ink">
              Get Club Pro
            </a>
          </div>
          <div className="flex flex-col rounded-3xl border-2 border-ink/15 bg-white p-8">
            <h3 className="text-lg font-semibold">Business</h3>
            <p className="mt-2 text-4xl font-bold">$29<span className="text-base font-normal text-ink/60">/month</span></p>
            <ul className="mt-6 flex-1 space-y-2 text-ink/75">
              <li>✓ Everything in Club Pro</li>
              <li>✓ Built for local cafés, gyms &amp; shops</li>
              <li>✓ Promos, launches and weekly specials</li>
            </ul>
            <a href="/api/checkout?plan=business" className="mt-8 block rounded-full border-2 border-ink py-3 text-center font-semibold hover:bg-ink hover:text-cream">
              Get Business
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink/10 py-8 text-center text-sm text-ink/60">
        © {new Date().getFullYear()} ClubPost · Made at Penn State
      </footer>
    </main>
  );
}
