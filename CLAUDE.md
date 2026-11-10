# ClubPost

AI social media assistant for student organizations. A club officer pastes event details, picks a tone, and gets an Instagram caption, hashtags, a reel script, story text, and a week of posts.

## Stack
- Next.js (App Router, TypeScript, Tailwind) — hosted on Vercel
- Neon (Postgres) for users and saved posts
- Stripe for the $5/month "Club Pro" plan
- An AI API (e.g. Anthropic) for the generator — key stored in Vercel env vars, never in code

## Project requirements (class assignment)
The finished app must let a stranger:
1. Land on a homepage that explains the product and why it's worth paying for
2. Create an account and log back in (real auth)
3. Use the core AI feature (the post generator)
4. Pay through a real Stripe checkout (a live $1 charge is used as proof)

**Demo account (required):** email `demo@demo.com`, password `password123!`.
It must already exist (seed it), skip email verification, and have full paid access.

## Environment variables (set in Vercel)
- DATABASE_URL — added automatically by the Neon integration
- ANTHROPIC_API_KEY — Claude API key
- STRIPE_SECRET_KEY — Stripe secret key (sk_test_… for testing, sk_live_… for the Week 4 live charge)
- Optional: SESSION_SECRET, ANTHROPIC_MODEL

## Pricing
Free (3 posts/month) · Club Pro $12/month · Business $29/month

## Status
- [x] Week 1: landing page deployed
- [x] Week 1: income statement, pitch video
- [x] Week 2: email/password auth (src/lib/auth.ts, src/app/actions.ts), Neon via `pg` (src/lib/db.ts — tables auto-created, demo account auto-seeded), AI generator (src/lib/ai.ts, /api/generate, Claude Haiku), Stripe Checkout subscriptions (/api/checkout, /billing/success)
- [ ] Week 3: debugging, peer feedback
- [ ] Week 4: customer outreach
