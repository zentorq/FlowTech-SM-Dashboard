# FlowTech Media SM Dashboard (Next.js)

Your original single-file HTML login/dashboard, converted into a real Next.js
(React) app with working account creation, sign-in, and a protected dashboard
route backed by your Neon PostgreSQL database.

The visual design is preserved from your original HTML (same colors, layout,
panels, tabs, and responsive breakpoints).

## What is real now vs. still a demo

REAL:
- Account creation and sign-in against the `users` table in your Neon database.
- Passwords are hashed with bcrypt. Plain passwords are never stored.
- Sessions are random tokens stored in a `sessions` table, sent to the browser
  as an httpOnly cookie (JavaScript cannot read it).
- `/dashboard` is protected two ways: `middleware.ts` checks a cookie exists,
  and the dashboard page re-validates the session against the database.

STILL A DEMO (deliberately, so nobody mistakes it for production):
- The four metric cards are the static sample numbers from your original page.
  They are placeholders, not live social-media data. Wire real platform APIs
  (Google, Meta, X, LinkedIn) in later.
- "Continue as Guest" shows the same sample metrics with a demo banner.
- "Forgot password?" shows a note but sends no email yet. To make it real,
  connect an email provider (Resend, Postmark, etc.) and add a reset-token
  table and flow.
- The old "Disconnect session" button from the HTML only showed an alert, so
  it was removed. Sign out is real.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and paste your Neon connection string
   as `DATABASE_URL` (Neon dashboard -> your project -> Connection Details).
   Never commit `.env.local` or paste the connection string into chat or code.
3. Run locally: `npm run dev` and open http://localhost:3000
4. The `users` and `sessions` tables are created automatically on first
   sign-up/sign-in.

## Push to GitHub

1. Create a new private repository on github.com (e.g. `flowtech-dashboard`).
2. In this folder:
   git init
   git add .
   git commit -m "FlowTech dashboard: Next.js + Neon auth"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/flowtech-dashboard.git
   git push -u origin main

## Deploy to Vercel

1. On vercel.com, import the GitHub repository (New Project -> Import).
2. Before deploying, add the environment variable:
   Project -> Settings -> Environment Variables ->
   `DATABASE_URL` = your Neon connection string (Production + Preview).
3. Deploy. Vercel builds Next.js automatically, no extra config needed.

## Attach dashboard.flowtechmedia.com

1. In Vercel: Project -> Settings -> Domains -> Add `dashboard.flowtechmedia.com`.
2. Vercel shows a CNAME record to create. In the DNS provider that hosts
   flowtechmedia.com, add:
   CNAME  dashboard  ->  cname.vercel-dns.com
3. Wait for DNS to propagate (usually minutes). Vercel issues HTTPS
   automatically.

## Project structure

- `app/page.tsx` + `app/LoginForm.tsx` - the sign-in / create-account screen
- `app/dashboard/page.tsx` - protected dashboard
- `app/actions.ts` - server actions: signUp, signIn, signOut, continueAsGuest
- `lib/db.ts` - Neon connection + auto-created tables
- `lib/auth.ts` - session helpers
- `middleware.ts` - route guard for /dashboard
- `app/globals.css` - your original design, verbatim, plus small additions
- `public/flowtech-logo.png` - PUT YOUR LOGO HERE (same filename)
