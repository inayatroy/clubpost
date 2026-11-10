import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { PLANS } from "@/lib/db";
import { siteUrl, stripe } from "@/lib/stripe";

// GET /api/checkout?plan=club_pro|business → sends the user to Stripe Checkout.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const base = siteUrl(req);
  const plan = url.searchParams.get("plan") === "business" ? "business" : "club_pro";

  const user = await getUser();
  if (!user) {
    const next = `/dashboard?checkout=${plan}`;
    return NextResponse.redirect(`${base}/signup?next=${encodeURIComponent(next)}`, 303);
  }
  if (user.plan === plan) return NextResponse.redirect(`${base}/dashboard`, 303);

  try {
    const p = PLANS[plan];
    const session = await stripe().checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      client_reference_id: String(user.id),
      metadata: { user_id: String(user.id), plan },
      subscription_data: { metadata: { user_id: String(user.id), plan } },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: p.cents,
            recurring: { interval: "month" },
            product_data: { name: `ClubPost ${p.name}`, description: "Unlimited AI posts, reel scripts and weekly content plans" },
          },
        },
      ],
      success_url: `${base}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/dashboard?canceled=1`,
    });
    return NextResponse.redirect(session.url!, 303);
  } catch (e) {
    const msg = encodeURIComponent((e as Error).message || "Checkout failed.");
    return NextResponse.redirect(`${base}/dashboard?error=${msg}`, 303);
  }
}
