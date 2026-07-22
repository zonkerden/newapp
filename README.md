# Vessel

A daily wellness tracker built around one idea: your body is a vessel you fill in a little each day. Four modules, one shared visual language.

- **Water** — log cups of water against a daily goal, plus a running log of meals
- **Sleep** — record bedtime/wake time against an 8-hour goal, with a guided wind-down routine
- **Breathe** — box breathing and 4-7-8 guided sessions with a live timer
- **Reminders** — medication/supplement/symptom checklist with browser notification support

## Stack

React + Vite + TypeScript, wrapped for Android with Capacitor. Data is stored locally on-device (`localStorage`) as the source of truth, with optional Supabase sync layered on top for cross-device access — the app works fully offline if you skip sign-in.

## Supabase setup (optional — for cross-device sync)

1. In your Supabase project's SQL editor, run `supabase/schema.sql` once. It's namespaced (`vessel_*` tables) so it's safe to run in a project shared with other apps.
2. Copy `.env.example` to `.env.local` and fill in your project's URL and anon key (Project Settings → API).
3. For the deployed build, add the same two values as **repo secrets**: Settings → Secrets and variables → Actions → `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. In the app, tap **Sign in** in the header and enter an email — it sends a magic link, no password.

Without these three steps the app just runs on localStorage alone; nothing breaks.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build       # web bundle -> dist/
npx cap add android # first time only
npx cap sync android
```

## CI/CD

- `.github/workflows/build.yml` — builds the web bundle and an Android debug APK on every push, uploaded as workflow artifacts
- `.github/workflows/deploy.yml` — auto-deploys the web bundle to GitHub Pages on every push to `main`

To get the Pages deploy live, enable **Settings -> Pages -> Source: GitHub Actions** in the repo once.
