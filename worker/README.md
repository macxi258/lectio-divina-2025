# Lectio Bible Proxy — Cloudflare Worker

A small Cloudflare Worker that injects the API.Bible secret key on the
server side so it never ships inside the client bundle.

```
Browser/APK ─→ Worker (adds api-key) ─→ rest.api.bible ─→ back to client
```

## One-time setup

You only do this once per machine.

### 1. Create a Cloudflare account
Free tier — no card required. Sign up at <https://dash.cloudflare.com/sign-up>.

### 2. Install dependencies

From `app/worker/`:

```bash
npm install
```

### 3. Sign in to Cloudflare from the CLI

```bash
npx wrangler login
```

A browser window will open. Click **Allow** to authorize wrangler.

### 4. Set the API.Bible secret on Cloudflare

```bash
npx wrangler secret put BIBLE_API_KEY
```

Paste your API.Bible key when prompted (the same one you put in
`.env.local`). The secret is stored on Cloudflare's servers, encrypted at
rest, and is never echoed back. **Never commit this key to git.**

### 5. Deploy the Worker

```bash
npx wrangler deploy
```

Wrangler prints the deployed URL. It will look like:

```
https://lectio-bible-proxy.<your-subdomain>.workers.dev
```

Copy that URL.

### 6. Point the app at the Worker

In `app/.env.local`, replace your old `VITE_BIBLE_API_KEY` line with:

```
VITE_BIBLE_PROXY_URL=https://lectio-bible-proxy.<your-subdomain>.workers.dev
```

(Keep `VITE_BIBLE_API_BIBLE_ID` as-is — that's not a secret.)

### 7. Rebuild the app

```bash
cd ..        # back to app/
npm run build
npx cap sync android
```

Now the bundle calls the Worker URL only — the API.Bible key is no longer
in the client.

## Updating the key later

If you regenerate the API.Bible key:

```bash
cd app/worker
npx wrangler secret put BIBLE_API_KEY
```

Paste the new value. Existing app installs keep working — only the Worker
needs to know.

## Allow-list new domains

When you host the PWA on a real domain, add it to `ALLOWED_ORIGINS` in
`worker.js`, then redeploy:

```bash
npx wrangler deploy
```

## Useful commands

```bash
npm run dev      # Run the worker locally on port 8787 for testing
npm run tail     # Live-stream production logs
```

## Free-tier limits

Cloudflare Workers free tier: **100,000 requests / day**. Far more than a
personal Lectio Divina app will consume. The Worker also caches identical
passage requests at Cloudflare's edge for 24 hours, so most lookups never
even hit API.Bible.
