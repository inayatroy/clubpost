"use client";

import { useState } from "react";
import type { PostKit } from "@/lib/ai";

const VIBES = ["Hype", "Chill", "Professional", "Funny", "Wholesome"];

function Copy({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="shrink-0 rounded-full border border-ink/20 px-3 py-1 text-xs font-semibold hover:bg-ink hover:text-cream"
    >
      {done ? "Copied!" : "Copy"}
    </button>
  );
}

function Card({ title, copy, children }: { title: string; copy?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-ink/10">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        {copy && <Copy text={copy} />}
      </div>
      {children}
    </div>
  );
}

export function KitView({ kit }: { kit: PostKit }) {
  const reelText = [
    `Hook: ${kit.reel.hook}`,
    ...kit.reel.scenes.map((s, i) => `${i + 1}. ${s.shot} — on screen: "${s.on_screen_text}"`),
    `CTA: ${kit.reel.call_to_action}`,
  ].join("\n");
  return (
    <div className="space-y-4">
      <Card title="📸 Instagram caption" copy={`${kit.caption}\n\n${kit.hashtags.join(" ")}`}>
        <p className="whitespace-pre-line">{kit.caption}</p>
        <p className="mt-3 text-sm text-[#2f6fb3]">{kit.hashtags.join(" ")}</p>
      </Card>
      <Card title="🎬 Reel script" copy={reelText}>
        <p className="mb-3 font-medium">Hook: “{kit.reel.hook}”</p>
        <ol className="space-y-2 text-sm">
          {kit.reel.scenes.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sun text-xs font-bold">{i + 1}</span>
              <span>{s.shot} <span className="text-ink/60">— on screen: “{s.on_screen_text}”</span></span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm"><span className="font-semibold">Call to action:</span> {kit.reel.call_to_action}</p>
      </Card>
      <Card title="📱 Story frames" copy={kit.story_frames.join("\n\n")}>
        <div className="grid gap-3 sm:grid-cols-3">
          {kit.story_frames.map((f, i) => (
            <div key={i} className="rounded-xl bg-ink p-4 text-sm text-cream">{f}</div>
          ))}
        </div>
      </Card>
      <Card title="📅 Your week of posts">
        <div className="space-y-3">
          {kit.week_plan.map((p, i) => (
            <div key={i} className="flex items-start justify-between gap-3 rounded-xl border border-ink/10 p-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#b33a1f]">{p.day} · {p.type}</p>
                <p className="mt-1 whitespace-pre-line text-sm">{p.caption}</p>
              </div>
              <Copy text={p.caption} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function Generator({ defaultClub, defaultVoice }: { defaultClub: string; defaultVoice: string }) {
  const [clubName, setClubName] = useState(defaultClub);
  const [clubVoice, setClubVoice] = useState(defaultVoice);
  const [eventDetails, setEventDetails] = useState("");
  const [vibe, setVibe] = useState("Hype");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ msg: string; upgrade?: boolean } | null>(null);
  const [kit, setKit] = useState<PostKit | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubName, clubVoice, eventDetails, vibe }),
      });
      const data = await res.json();
      if (!res.ok) setError({ msg: data.error || "Something went wrong.", upgrade: data.upgrade });
      else setKit(data.kit);
    } catch {
      setError({ msg: "Couldn't reach the server. Check your connection and try again." });
    } finally {
      setLoading(false);
    }
  }

  const input = "w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-3 outline-none focus:border-coral";
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <form onSubmit={submit} className="h-fit space-y-4 rounded-3xl border-2 border-ink bg-white p-6">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Club name</span>
          <input value={clubName} onChange={(e) => setClubName(e.target.value)} className={input} placeholder="PSU Entrepreneurs" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Your club&apos;s voice <span className="font-normal text-ink/50">(optional)</span></span>
          <input value={clubVoice} onChange={(e) => setClubVoice(e.target.value)} className={input}
            placeholder="e.g. witty, lowercase, lots of 🍕" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Event details</span>
          <textarea value={eventDetails} onChange={(e) => setEventDetails(e.target.value)} required rows={6} className={input}
            placeholder="pitch night, thurs 7pm, Business Building 120, free insomnia cookies, anyone can pitch an idea in 60 sec" />
        </label>
        <div>
          <span className="mb-2 block text-sm font-semibold">Vibe</span>
          <div className="flex flex-wrap gap-2">
            {VIBES.map((v) => (
              <button key={v} type="button" onClick={() => setVibe(v)}
                className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold ${vibe === v ? "border-ink bg-ink text-cream" : "border-ink/15 hover:border-ink"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <button disabled={loading}
          className="w-full rounded-full bg-coral py-3 font-semibold text-white shadow-[4px_4px_0_0_#1d2340] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#1d2340] disabled:opacity-60">
          {loading ? "Writing your posts… ✍️" : "Generate my posts ✨"}
        </button>
        {error && (
          <div className="rounded-xl bg-coral/10 px-4 py-3 text-sm font-medium text-[#b33a1f]">
            {error.msg}
            {error.upgrade && (
              <a href="/api/checkout?plan=club_pro" className="mt-2 block font-bold underline">Upgrade to Club Pro →</a>
            )}
          </div>
        )}
      </form>
      <div>
        {kit ? (
          <KitView kit={kit} />
        ) : (
          <div className="flex h-full min-h-64 items-center justify-center rounded-3xl border-2 border-dashed border-ink/20 p-8 text-center text-ink/60">
            {loading ? "Thinking up something good… this takes about 10 seconds." : "Your caption, reel script, story text and week of posts will show up here."}
          </div>
        )}
      </div>
    </div>
  );
}
