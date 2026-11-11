# NEO ARCADE V2 — backend setup

This branch prepares the Supabase data layer. The existing stable app remains on `main`.

## What this foundation provides
- Unique player handles (3–20 characters: lowercase letters, digits and underscores).
- Private per-player progression storage for cross-device sync.
- Public score rows for future leaderboards.
- Battle records and a Realtime-enabled battles table.
- Row Level Security policies so a player cannot read another player's private progression.

## Setup (parent/guardian should supervise)
1. Create a Supabase project.
2. Open **SQL Editor**, paste and run `supabase/schema.sql`.
3. In **Authentication → Providers → Email**, disable email confirmation if using username-only sign-in with an internal login alias. Supabase Auth's password system still needs an email-shaped login identifier; the app can derive a non-deliverable internal identifier from the username. This means password recovery cannot work by itself.
4. If you want password recovery, add and verify a real recovery email flow before enabling it. Do not collect a recovery address unless you implement and test the recovery process.
5. Copy `config.example.js` to `config.js`, then add the project URL and publishable/anon key. Never use the service_role key in frontend code.
6. Add `config.js` to the app's load order before the application script. Do not commit real project secrets to a public repository.

## Important security note
The policies here are a starting point, not a finished anti-cheat system. Browser-submitted scores can be forged. Before running public online competitions, validate scores and battle state changes in trusted server-side functions, apply rate limits, and review the policies. Do not treat client-side checks as security.

## Current status
The current production app on `main` still uses localStorage. This branch deliberately does not silently switch the live app to an unconfigured backend. Authentication UI, tested cloud sync, the two new games, and both battle modes still need implementation and end-to-end testing after a Supabase project is configured.
