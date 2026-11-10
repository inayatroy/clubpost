import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { FREE_MONTHLY_LIMIT, isPaid, pool } from "@/lib/db";
import { generatePostKit, VIBES } from "@/lib/ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Please log in first." }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const eventDetails = String(body.eventDetails ?? "").trim().slice(0, 2000);
  const clubName = String(body.clubName ?? "").trim().slice(0, 120);
  const clubVoice = String(body.clubVoice ?? "").trim().slice(0, 400);
  const vibe = VIBES.includes(body.vibe) ? body.vibe : "Hype";
  if (eventDetails.length < 10) {
    return NextResponse.json({ error: "Tell us a bit more about the event (at least a sentence)." }, { status: 400 });
  }

  const db = pool();
  if (!isPaid(user)) {
    const { rows } = await db.query(
      "SELECT COUNT(*)::int AS n FROM generations WHERE user_id = $1 AND created_at >= date_trunc('month', now())",
      [user.id]
    );
    if (rows[0].n >= FREE_MONTHLY_LIMIT) {
      return NextResponse.json(
        { error: `You've used your ${FREE_MONTHLY_LIMIT} free posts this month. Upgrade to Club Pro for unlimited posts.`, upgrade: true },
        { status: 402 }
      );
    }
  }

  try {
    const kit = await generatePostKit({ clubName, clubVoice, eventDetails, vibe });
    await db.query(
      "INSERT INTO generations (user_id, event_details, vibe, output) VALUES ($1, $2, $3, $4)",
      [user.id, eventDetails, vibe, JSON.stringify(kit)]
    );
    // Remember the club's name and voice for next time.
    await db.query("UPDATE users SET club_name = $1, club_voice = $2 WHERE id = $3", [clubName || null, clubVoice || null, user.id]);
    return NextResponse.json({ kit });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "The AI had a hiccup. Try again." }, { status: 500 });
  }
}
