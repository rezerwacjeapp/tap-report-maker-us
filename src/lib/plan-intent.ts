/**
 * "Choose Solo" on the landing page leads to /register?plan=solo. We remember the
 * choice until the user is signed in (also after the email link and Google sign-in),
 * then open the purchase page /upgrade.
 */
const KEY = "raporton_pending_plan";
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 h

export function wantsSolo(search: string): boolean {
  return new URLSearchParams(search).get("plan") === "solo";
}

export function rememberSoloIntent(now = Date.now()): void {
  try {
    localStorage.setItem(KEY, String(now));
  } catch {
    /* no localStorage - after sign-in the upgrade button on Home is still there */
  }
}

export function hasSoloIntent(now = Date.now()): boolean {
  try {
    const at = Number(localStorage.getItem(KEY));
    return at > 0 && now - at < MAX_AGE_MS;
  } catch {
    return false;
  }
}

/** True if there was a fresh Solo choice; clears it so we redirect only once. */
export function takeSoloIntent(now = Date.now()): boolean {
  const fresh = hasSoloIntent(now);
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  return fresh;
}
