# Vessel

A daily wellness tracker built around one idea: your body is a vessel you fill in a little each day. Four modules, one shared visual language.

- **Water** — log cups of water against a daily goal, plus a running log of meals
- **Sleep** — record bedtime/wake time against an 8-hour goal, with a guided wind-down routine
- **Breathe** — box breathing and 4-7-8 guided sessions with a live timer
- **Reminders** — medication/supplement/symptom checklist with browser notification support

## Stack

React + Vite + TypeScript, wrapped for Android with Capacitor. Data is stored locally on-device (`localStorage`) — there's no backend in this MVP.

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
