/**
 * Lectio Divina — API.Bible proxy
 *
 * A tiny Cloudflare Worker that injects the API.Bible secret key on the
 * server side so it never has to ship inside the client bundle (PWA / APK).
 *
 *   Browser/APK  →  Worker  (adds api-key header)  →  rest.api.bible
 *                ←──────────  forwards response  ──────────────────
 *
 * The key lives in a Worker secret named BIBLE_API_KEY (set with
 * `wrangler secret put BIBLE_API_KEY`). The client never sees it.
 *
 * Hardening:
 *   • GET only — POST/PUT/DELETE rejected
 *   • Only forwards paths that start with /v1/bibles/ — no proxying anything else
 *   • CORS allow-list — origins not on the list get blocked
 *   • Strips inbound api-key headers so callers can't pass their own
 */

const TARGET = 'https://rest.api.bible';

// Add your PWA / dev / native origins here. Cloudflare also accepts the
// special value '*', but a fixed allow-list is safer.
const ALLOWED_ORIGINS = [
  'http://localhost:5173',          // Vite dev server
  'http://localhost:4173',          // Vite preview
  'https://localhost',              // Capacitor Android (newer)
  'capacitor://localhost',          // Capacitor iOS / older Android
  // 'https://lectio-divina.your-domain.com', // <-- add your hosted PWA origin once you deploy it
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? '';
    const cors = corsHeaders(origin);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // Only GET is allowed
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: cors });
    }

    // Path safety — only forward Bible passage requests
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/v1/bibles/')) {
      return new Response('Not found', { status: 404, headers: cors });
    }

    // Make sure the secret is configured
    if (!env.BIBLE_API_KEY) {
      return new Response('Worker missing BIBLE_API_KEY secret', {
        status: 500,
        headers: cors,
      });
    }

    // Forward to API.Bible
    let upstream;
    try {
      upstream = await fetch(`${TARGET}${url.pathname}${url.search}`, {
        method: 'GET',
        headers: {
          'api-key': env.BIBLE_API_KEY,
          'Accept': 'application/json',
        },
        // Cache identical passage requests for 1 day at the edge to reduce
        // upstream calls and stay well below the free-tier quota.
        cf: { cacheTtl: 86400, cacheEverything: true },
      });
    } catch {
      return new Response(JSON.stringify({ error: 'upstream_unreachable' }), {
        status: 502,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        ...cors,
        'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  },
};
