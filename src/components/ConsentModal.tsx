import { useState } from "react";
import { saveConsent } from "@/lib/supabase-storage";
import { Loader2 } from "lucide-react";
import { BrandLockup } from "@/components/BrandLogo";

interface Props {
  onAccepted: () => void;
}

export function ConsentModal({ onAccepted }: Props) {
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAccept = async () => {
    if (!terms) {
      setError("You need to accept the Terms of Service to use the app.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await saveConsent(marketing);
      onAccepted();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-5">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-xl p-6 space-y-5">
        <div className="text-center space-y-1">
          <h2 className="flex justify-center">
            <BrandLockup markClassName="h-7 w-auto" textClassName="text-xl" />
          </h2>
          <p className="text-sm text-muted-foreground">One more step - please confirm below</p>
        </div>

        <div className="space-y-3">
          {/* Required: terms */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => { setTerms(e.target.checked); setError(""); }}
              className="mt-0.5 h-5 w-5 rounded border-border accent-accent shrink-0"
            />
            <span className="text-sm leading-snug">
              I am at least 18 years old and I agree to the{" "}
              <a href="/terms" target="_blank" className="text-accent underline">Terms of Service</a>
              {" "}and{" "}
              <a href="/privacy" target="_blank" className="text-accent underline">Privacy Policy</a>
              {" "}<span className="text-destructive">*</span>
            </span>
          </label>

          {/* Optional: marketing */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-border accent-accent shrink-0"
            />
            <span className="text-sm leading-snug text-muted-foreground">
              Send me occasional emails about RaportON updates and offers
            </span>
          </label>
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <button
          onClick={handleAccept}
          disabled={loading}
          className="w-full h-12 rounded-xl bg-accent text-white font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue to the app"}
        </button>

        <p className="text-[11px] text-muted-foreground text-center">
          <span className="text-destructive">*</span> required
        </p>
      </div>
    </div>
  );
}
