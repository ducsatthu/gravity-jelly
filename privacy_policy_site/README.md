# Gravity Jelly — Privacy Policy site

A single static page (`index.html`) hosting the Gravity Jelly privacy policy,
ready to deploy to Vercel as a static site. The resulting public HTTPS URL goes
into:

- **Google Play Console** → App content → Privacy policy
- **AdMob** → App settings → Privacy policy URL
- The in-app Settings → "Privacy policy" link

The policy covers the App's data practices: **Google AdMob** (ads) and
**Google Play Games Services** (optional leaderboard sign-in), plus local
on-device game data. Keep it in sync with the app's actual services.

## Deploy to Vercel

### Option A — one-command script (recommended)
One-time setup, then every deploy is a single command.

```bash
cd privacy_policy_site
cp .env.example .env          # then edit .env and paste your VERCEL_TOKEN
./deploy.sh                   # builds nothing — pushes the static site to prod
```
- Get a token at <https://vercel.com/account/tokens>.
- First run (with `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` left blank) creates a
  **new** Vercel project named after this folder and prints the **Production URL**.
- The script uses a global `vercel` if installed, otherwise falls back to
  `npx vercel@latest` (no global install needed; just Node.js/npx).
- For deterministic re-deploys, after the first run copy `VERCEL_ORG_ID` /
  `VERCEL_PROJECT_ID` from `.vercel/project.json` into `.env`.
- `.env` is gitignored — never commit your token.

### Option B — Vercel dashboard
1. Push this folder to a GitHub repo (or this monorepo).
2. vercel.com → Add New → Project → import the repo.
3. Set **Root Directory** to `privacy_policy_site`. Framework preset: **Other**
   (no build step — it's a static file).
4. Deploy → copy the production URL.

## Notes
- Keep it as a **static** deploy (no build/serverless) so the link is always
  online — Play re-crawls the URL periodically and may flag the app if it 404s.
- Do **not** delete the Vercel project after submitting.
- If the developer name, contact email, or data practices change (e.g. adding a
  new SDK), update `index.html` and the "Last updated" date, then redeploy.
- A custom domain is optional; the `*.vercel.app` URL is accepted by Play.
