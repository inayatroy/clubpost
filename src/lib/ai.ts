import Anthropic from "@anthropic-ai/sdk";

export type PostKit = {
  caption: string;
  hashtags: string[];
  reel: { hook: string; scenes: { shot: string; on_screen_text: string }[]; call_to_action: string };
  story_frames: string[];
  week_plan: { day: string; type: string; caption: string }[];
};

export const VIBES = ["Hype", "Chill", "Professional", "Funny", "Wholesome"] as const;

const SYSTEM = `You are ClubPost, a social media assistant for college student organizations.
You write Instagram content that sounds like a real student club, not a brand or a robot.
Rules:
- Match the club's voice description if one is given. Otherwise match the requested vibe.
- Use every concrete detail the user gives (name, date, time, place, free food, how to join). Never invent dates, times, places, prices or names that were not given; if a detail is missing, write around it.
- Captions: 2-4 short lines, a hook first, a clear call to action, emojis only if they fit the vibe.
- Hashtags: 6-10, mix of school-specific and topic tags, no spaces, include the # symbol.
- Reel: a scroll-stopping hook line, 4-6 short shots a student could film on a phone, on-screen text for each, and a call to action.
- Story frames: 3 short frames of story text (poll/countdown ideas welcome).
- Week plan: 4 posts timed around the event — a teaser, a reminder, a day-of post and a recap — each with its own ready-to-post caption. Use relative days like "3 days before" if no date is given.
Respond with ONLY a JSON object, no markdown, in exactly this shape:
{"caption": string, "hashtags": string[], "reel": {"hook": string, "scenes": [{"shot": string, "on_screen_text": string}], "call_to_action": string}, "story_frames": string[], "week_plan": [{"day": string, "type": string, "caption": string}]}`;

export async function generatePostKit(input: {
  clubName: string;
  clubVoice: string;
  eventDetails: string;
  vibe: string;
}): Promise<PostKit> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("The AI isn't connected yet: add ANTHROPIC_API_KEY in Vercel → Settings → Environment Variables, then redeploy.");
  }
  const client = new Anthropic();
  const user = [
    `Club name: ${input.clubName || "(not given)"}`,
    `Club voice: ${input.clubVoice || "(not given)"}`,
    `Vibe: ${input.vibe}`,
    `Event details (may be messy notes):\n${input.eventDetails}`,
  ].join("\n");

  const msg = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5",
    max_tokens: 2500,
    system: SYSTEM,
    messages: [{ role: "user", content: user }],
  });
  const text = msg.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("")
    .trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("The AI returned an unexpected answer. Please try again.");
  const kit = JSON.parse(text.slice(start, end + 1)) as PostKit;
  // Light normalization so the page never crashes on a missing field.
  return {
    caption: kit.caption ?? "",
    hashtags: Array.isArray(kit.hashtags) ? kit.hashtags : [],
    reel: {
      hook: kit.reel?.hook ?? "",
      scenes: Array.isArray(kit.reel?.scenes) ? kit.reel.scenes : [],
      call_to_action: kit.reel?.call_to_action ?? "",
    },
    story_frames: Array.isArray(kit.story_frames) ? kit.story_frames : [],
    week_plan: Array.isArray(kit.week_plan) ? kit.week_plan : [],
  };
}
