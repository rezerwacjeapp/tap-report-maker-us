/**
 * Cloudflare Worker entry for servisheet.com.
 * Static files (the app, landing, legal pages) are served from ./dist by Cloudflare;
 * this script runs only for "/" and /api/* (see run_worker_first in wrangler.jsonc).
 *
 * "/" does what middleware.ts did on Vercel: visitors and search engines get the
 * marketing page (landing.html) right at the root URL. Signed-in browsers carry the
 * ro_session cookie (set by the app, see use-auth) and get the app. A sign-in callback
 * with ?code= (or an auth error) also goes to the app.
 */
import { handleStripeWebhook, type Env as WebhookEnv } from "../functions/api/stripe-webhook";

interface Env extends WebhookEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/stripe-webhook") return handleStripeWebhook(request, env);

    if (url.pathname === "/") {
      const signedIn = /(?:^|;\s*)ro_session=1(?:;|$)/.test(request.headers.get("cookie") || "");
      if (!signedIn && !url.searchParams.has("code") && !url.searchParams.has("error_description")) {
        // "/landing", not "/landing.html": Cloudflare serves landing.html under the
        // address without .html and answers the .html one with a redirect.
        url.pathname = "/landing";
        return env.ASSETS.fetch(new Request(url, request));
      }
    }

    return env.ASSETS.fetch(request);
  },
};
