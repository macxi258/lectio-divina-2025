/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * URL of the Cloudflare Worker proxy that forwards requests to
   * scripture.api.bible (rest.api.bible) with the secret API key
   * injected server-side. Looks like:
   *   https://lectio-bible-proxy.<your-subdomain>.workers.dev
   *
   * The proxy keeps the API.Bible key off the client. See
   * `worker/README.md` for setup.
   */
  readonly VITE_BIBLE_PROXY_URL?: string;
  /**
   * Bible identifier on api.bible — e.g. `179568874c45066f-01` for the
   * Douay-Rheims American 1899 (Catholic English). Not a secret.
   */
  readonly VITE_BIBLE_API_BIBLE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
