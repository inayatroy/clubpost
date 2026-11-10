import Stripe from "stripe";

export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Payments aren't connected yet: add STRIPE_SECRET_KEY in Vercel → Settings → Environment Variables, then redeploy.");
  }
  return new Stripe(key);
}

export function siteUrl(req: Request) {
  const h = req.headers;
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
