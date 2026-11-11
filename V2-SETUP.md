# NEO ARCADE V2 — backend setup

This branch prepares the Supabase data layer. The stable V1 remains on `main`.

## Current backend foundation
- Unique player handles: 3–20 characters, lowercase letters, digits and underscores.
- Private per-player progression storage for cross-device sync.
- Public score rows for future leaderboards.
- Battle records and a Realtime-enabled battles table.
- Row Level Security policies.
- A database trigger that creates a profile and an empty progression row when a new Auth user is created.

## Supabase setup
1. Open **SQL Editor** and run `supabase/schema.sql`.
2. In **Authentication → Sign In / Providers**, keep **Email** enabled and **Allow new users to sign up** enabled.
3. For the username-only prototype, turn **Confirm email** off and save. This is required because the prototype derives a non-deliverable email-shaped Auth identifier from the username.
4. The planned login identifier is `lowercase_username@neo-arcade.invalid`. The `.invalid` domain is intentionally non-deliverable. Users therefore cannot receive password-reset emails. Do not advertise account recovery until a real verified recovery method has been implemented.
5. Use pseudonyms only; do not ask players for real names. Handles must match `^[a-z0-9_]{3,20}$`.
6. Configure the app with the project URL and the publishable/anon key. Never use a service_role or secret key in browser code.

## Important security and product limitations
- Disabling email confirmation is a deliberate prototype trade-off, not a production-ready account system.
- If a player forgets their password, there is no email-based recovery in this prototype. Consider adding an optional verified recovery email or another secure recovery method before a public launch.
- Never store plaintext passwords yourself. Password authentication must be handled by Supabase Auth.
- The RLS policies are a starting point, not a finished anti-cheat system. Browser-submitted scores can be forged. Before public online competitions, validate scores and battle state transitions in trusted server-side functions and apply rate limits.
- A public profile query must not expose private contact information. The schema does not store recovery email addresses.

## Current implementation status
The current app files on this branch still contain the V1 gameplay and localStorage progression. This commit improves the database setup only; it does **not** yet implement the signup/login screens, cloud sync, new games, or Battle modes. Those must be added and tested before V2 is considered playable.
