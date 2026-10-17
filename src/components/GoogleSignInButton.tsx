import { useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

/**
 * "Continue with Google" rendered by Google Identity Services.
 *
 * The sign-in happens in a Google popup on raporton.com, so Google shows
 * "raporton.com" instead of the Supabase project address. The returned ID token
 * is exchanged for a Supabase session with signInWithIdToken (no redirect).
 *
 * If the Google script can't load (blocker, offline, no client ID), the
 * `fallback` is shown instead - the old redirect-based button.
 */

// Public value (it is visible in every sign-in request), safe to keep in code.
const GOOGLE_CLIENT_ID =
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ||
  "902657352342-3mkqk2fh92n2hhit9lohb8cgk4mv78nh.apps.googleusercontent.com";

const GSI_SRC = "https://accounts.google.com/gsi/client";

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleId {
  initialize: (config: Record<string, unknown>) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleId } };
  }
}

let gsiPromise: Promise<GoogleId> | null = null;

function loadGsi(): Promise<GoogleId> {
  if (window.google?.accounts?.id) return Promise.resolve(window.google.accounts.id);
  if (gsiPromise) return gsiPromise;

  gsiPromise = new Promise<GoogleId>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("timeout")), 8000);
    const done = () => {
      window.clearTimeout(timer);
      const id = window.google?.accounts?.id;
      if (id) resolve(id);
      else reject(new Error("unavailable"));
    };

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`);
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", done, { once: true });
    script.addEventListener(
      "error",
      () => {
        window.clearTimeout(timer);
        reject(new Error("load error"));
      },
      { once: true },
    );
    if (!existing) {
      script.src = GSI_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }).catch((err) => {
    gsiPromise = null; // allow a retry on the next mount
    throw err;
  });

  return gsiPromise;
}

function randomNonce(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

interface Props {
  /** Button label variant: "continue_with" (login) or "signup_with" (register). */
  text?: "continue_with" | "signup_with" | "signin_with";
  onError: (message: string) => void;
  fallback: ReactNode;
}

export default function GoogleSignInButton({ text = "continue_with", onError, fallback }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!GOOGLE_CLIENT_ID || !window.crypto?.subtle) {
        setStatus("fallback");
        return;
      }
      try {
        const gsi = await loadGsi();
        if (cancelled || !containerRef.current) return;

        const rawNonce = randomNonce();
        const hashedNonce = await sha256Hex(rawNonce);
        if (cancelled || !containerRef.current) return;

        gsi.initialize({
          client_id: GOOGLE_CLIENT_ID,
          nonce: hashedNonce,
          ux_mode: "popup",
          context: text === "signup_with" ? "signup" : "signin",
          itp_support: true,
          use_fedcm_for_button: true,
          callback: async (response: GoogleCredentialResponse) => {
            if (!response.credential) {
              onErrorRef.current("Google sign-in was cancelled. Please try again.");
              return;
            }
            const { error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: response.credential,
              nonce: rawNonce,
            });
            if (error) onErrorRef.current(error.message);
            // On success onAuthStateChange updates the session and the router
            // moves the user into the app.
          },
        });

        const width = Math.min(400, Math.max(200, Math.floor(containerRef.current.clientWidth)));
        gsi.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text,
          shape: "rectangular",
          logo_alignment: "center",
          width,
        });
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("fallback");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [text]);

  if (status === "fallback") return <>{fallback}</>;

  return (
    <div className="w-full min-h-12 flex items-center justify-center">
      <div ref={containerRef} className="w-full flex justify-center" />
    </div>
  );
}
