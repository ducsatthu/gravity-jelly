#!/usr/bin/env bash
#
# Deploy the Gravity Jelly privacy-policy static site to Vercel (production).
#
# One-time setup: copy .env.example → .env and fill in at least VERCEL_TOKEN.
# After that, deploying is a single command:
#
#     ./deploy.sh
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# --- Load configuration from .env -----------------------------------------
if [[ ! -f .env ]]; then
  echo "✗ .env not found. Run:  cp .env.example .env  then fill in VERCEL_TOKEN." >&2
  exit 1
fi
set -a
# shellcheck disable=SC1091
source .env
set +a

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "✗ VERCEL_TOKEN is empty in .env." >&2
  echo "  Create one at: https://vercel.com/account/tokens" >&2
  exit 1
fi

# VERCEL_ORG_ID / VERCEL_PROJECT_ID (if set in .env) are read automatically by
# the Vercel CLI and link to an existing project non-interactively. Leaving them
# blank on the first run makes the CLI create a new project.

# --- Locate the Vercel CLI (global, else npx — no global install needed) ---
if command -v vercel >/dev/null 2>&1; then
  VERCEL=(vercel)
elif command -v npx >/dev/null 2>&1; then
  VERCEL=(npx --yes vercel@latest)
else
  echo "✗ Neither 'vercel' nor 'npx' is available." >&2
  echo "  Install Node.js (which provides npx), or run:  npm i -g vercel" >&2
  exit 1
fi

# VERCEL_SCOPE selects the team/account slug when the token has no default scope
# (required in non-interactive mode if the account belongs to a team).
SCOPE_ARGS=()
if [[ -n "${VERCEL_SCOPE:-}" ]]; then
  SCOPE_ARGS=(--scope "$VERCEL_SCOPE")
fi

echo "→ Deploying privacy_policy_site to Vercel (production)…"
echo
"${VERCEL[@]}" deploy --prod --yes --token "$VERCEL_TOKEN" "${SCOPE_ARGS[@]}"
echo
echo "✓ Done. Copy the Production URL above into:"
echo "    • Google Play Console → App content → Privacy policy"
echo "    • AdMob → App settings → Privacy policy URL"
echo "    • In-app Settings → Privacy policy"
