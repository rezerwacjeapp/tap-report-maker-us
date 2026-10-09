import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isRecovery: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  clearRecovery: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

/**
 * Tells the server this browser is signed in, so "/" serves the app instead of
 * the landing page (see middleware.ts). Not a credential - only a routing hint.
 */
function markSignedIn(signedIn: boolean) {
  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `ro_session=${signedIn ? "1; Max-Age=31536000" : "; Max-Age=0"}; Path=/; SameSite=Lax${secure}`;
  } catch {
    // cookies blocked: "/" keeps showing the landing page, whose buttons lead into the app
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      markSignedIn(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      markSignedIn(!!session);

      // Detect password recovery flow
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: mapAuthError(error.message) };
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: mapAuthError(error.message) };
    return { error: null };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) return { error: mapAuthError(error.message) };
    return { error: null };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: mapAuthError(error.message) };
    setIsRecovery(false);
    return { error: null };
  };

  const clearRecovery = () => setIsRecovery(false);

  const signOut = async () => {
    setIsRecovery(false);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isRecovery, signUp, signIn, signInWithGoogle, resetPassword, updatePassword, clearRecovery, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** Map Supabase error messages to friendlier English */
function mapAuthError(msg: string): string {
  if (msg.includes("Invalid login credentials")) return "Incorrect email or password";
  if (msg.includes("User already registered")) return "An account with this email already exists";
  if (msg.includes("Email not confirmed")) return "Please confirm your email - check your inbox";
  if (msg.includes("Password should be at least")) return "Password must be at least 6 characters";
  if (msg.includes("Email rate limit exceeded")) return "Too many attempts - please try again shortly";
  if (msg.includes("For security purposes")) return "Too many attempts - wait a moment and try again";
  if (msg.includes("Signup requires a valid password")) return "Please enter a valid password";
  if (msg.includes("New password should be different")) return "Your new password must be different from the old one";
  return msg;
}
