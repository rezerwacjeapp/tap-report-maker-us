import { next, rewrite } from "@vercel/functions";

/**
 * Visitors and search engines get the marketing page (landing.html) right at the
 * root URL, instead of the app jumping to /landing.html in the browser.
 * Signed-in browsers carry the ro_session cookie (set by the app, see use-auth)
 * and get the app. A sign-in callback with ?code= also goes to the app.
 */
export const config = { matcher: "/" };

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const signedIn = /(?:^|;\s*)ro_session=1(?:;|$)/.test(request.headers.get("cookie") || "");
  if (signedIn || url.searchParams.has("code") || url.searchParams.has("error_description")) return next();
  return rewrite(new URL("/landing.html", request.url));
}
