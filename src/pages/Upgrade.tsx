import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, Zap, Infinity as InfinityIcon, Loader2, Droplet, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkReportLimit } from "@/lib/supabase-storage";
import { useAuth } from "@/hooks/use-auth";

// Stripe Payment Link of the US account (USD price). Set in Vercel as VITE_STRIPE_PAYMENT_LINK;
// without it the upgrade button is disabled, so nobody can pay through a wrong account.
const STRIPE_PAYMENT_LINK = (import.meta.env.VITE_STRIPE_PAYMENT_LINK as string | undefined)?.trim() || "";
// Stripe customer portal login link (Stripe → Settings → Billing → Customer portal → "Activate link").
// Set in Vercel as VITE_STRIPE_PORTAL_URL; without it the "Manage subscription" link is hidden.
const STRIPE_PORTAL_URL = (import.meta.env.VITE_STRIPE_PORTAL_URL as string | undefined)?.trim() || "";
const PRICE = "$9.99";

export default function Upgrade() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [planInfo, setPlanInfo] = useState<{
    count: number; limit: number; plan: string;
    trial?: boolean; trialDaysLeft?: number;
  } | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);

  useEffect(() => {
    checkReportLimit()
      .then((info) => setPlanInfo({
        count: info.count, limit: info.limit, plan: info.plan,
        trial: info.trial, trialDaysLeft: info.trialDaysLeft,
      }))
      .catch(() => {});
  }, []);

  // Handle return from Stripe — poll for subscription activation
  useEffect(() => {
    if (searchParams.get("success") !== "true") return;
    setCheckingPayment(true);

    let attempts = 0;
    const poll = setInterval(async () => {
      attempts++;
      try {
        const info = await checkReportLimit();
        if (info.plan === "solo") {
          clearInterval(poll);
          setPlanInfo({ count: 0, limit: Infinity, plan: "solo" });
          setCheckingPayment(false);
        }
      } catch {}
      if (attempts >= 15) {
        clearInterval(poll);
        setCheckingPayment(false);
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [searchParams]);

  const handleUpgrade = () => {
    if (!user || !STRIPE_PAYMENT_LINK) return;
    const url = `${STRIPE_PAYMENT_LINK}?client_reference_id=${user.id}&prefilled_email=${encodeURIComponent(user.email || "")}`;
    window.location.href = url;
  };

  // Checking payment state
  if (checkingPayment) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-background">
        <header className="flex items-center gap-2 px-5 pt-6 pb-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-lg font-semibold">Activating your plan</h1>
        </header>
        <main className="flex-1 px-5 py-6 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-10 w-10 text-accent animate-spin mb-4" />
          <h2 className="text-xl font-bold">Confirming your payment...</h2>
          <p className="text-muted-foreground mt-2">This may take a few seconds.</p>
        </main>
      </div>
    );
  }

  // Already on Solo
  if (planInfo?.plan === "solo") {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-background">
        <header className="flex items-center gap-2 px-5 pt-6 pb-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-lg font-semibold">Your plan</h1>
        </header>
        <main className="flex-1 px-5 py-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-2xl font-bold">Solo plan is active!</h2>
          <p className="text-muted-foreground mt-2">Unlimited reports, no watermark.</p>
          <Button className="mt-6" onClick={() => navigate("/")}>Back to the app</Button>
          {STRIPE_PORTAL_URL && (
            <div className="mt-8 max-w-xs">
              <a
                href={`${STRIPE_PORTAL_URL}${user?.email ? `?prefilled_email=${encodeURIComponent(user.email)}` : ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
              >
                <Settings2 className="h-4 w-4" /> Manage subscription
              </a>
              <p className="text-xs text-muted-foreground mt-2">
                Receipts, payment card and cancellation. If you cancel, Solo stays active until the end of the period you paid for.
              </p>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <header className="flex items-center gap-2 px-5 pt-6 pb-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-lg font-semibold">Upgrade</h1>
      </header>

      <main className="flex-1 px-5 py-6 space-y-6">
        {/* Current usage */}
        {planInfo && (
          <div className="rounded-2xl border border-border bg-card p-5">
            {planInfo.plan === "trial" ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Free trial</span>
                  <span className="text-sm text-blue-500 font-semibold">
                    {planInfo.trialDaysLeft} {planInfo.trialDaysLeft === 1 ? "day" : "days"} left
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${Math.max(10, ((planInfo.trialDaysLeft || 0) / 7) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Full access - reports without a watermark. After the trial, PDFs carry a watermark unless you upgrade to Solo.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Your current plan: Free</span>
                  <span className="text-sm text-accent font-semibold">with watermark</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Unlimited reports. Every PDF carries a "RaportON.com" watermark. Upgrade to Solo to remove it.
                </p>
              </>
            )}
          </div>
        )}

        {/* Plan comparison */}
        <div className="space-y-4">
          {/* Free plan */}
          <div className="rounded-2xl border border-border bg-card p-5 opacity-60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Free</h3>
                <p className="text-2xl font-bold mt-1">$0<span className="text-sm font-normal text-muted-foreground"> /month</span></p>
              </div>
              {planInfo?.plan !== "solo" && (
                <div className="px-3 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground">
                  {planInfo?.plan === "trial" ? "Free trial" : "Current plan"}
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <InfinityIcon className="h-4 w-4 text-accent shrink-0" /> Unlimited reports
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-accent shrink-0" /> All templates
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-accent shrink-0" /> Photos, signatures, dictation
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Droplet className="h-4 w-4 text-muted-foreground shrink-0" /> "RaportON.com" watermark on PDFs
              </div>
            </div>
          </div>

          {/* Solo plan */}
          <div className="rounded-2xl border-2 border-accent bg-card p-5 relative">
            <div className="absolute -top-3 left-5 px-3 py-0.5 rounded-full bg-accent text-white text-xs font-semibold">
              Recommended
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Solo</h3>
                <p className="text-2xl font-bold mt-1">{PRICE}<span className="text-sm font-normal text-muted-foreground"> /month</span></p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Droplet className="h-4 w-4 text-accent shrink-0" /> <strong>No watermark</strong> on PDFs
              </div>
              <div className="flex items-center gap-2 text-sm">
                <InfinityIcon className="h-4 w-4 text-accent shrink-0" /> Unlimited reports
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-accent shrink-0" /> Everything in Free
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-accent shrink-0" /> Priority support
              </div>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={!STRIPE_PAYMENT_LINK}
              className="w-full mt-6 h-12 rounded-xl bg-accent text-white font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg disabled:opacity-50 disabled:active:scale-100"
            >
              <Zap className="h-5 w-5" />
              Upgrade to Solo - {PRICE}/month
            </button>
            {STRIPE_PAYMENT_LINK ? (
              <p className="text-[11px] text-muted-foreground mt-3 leading-snug">
                Your subscription renews automatically every month at {PRICE} (plus any applicable sales tax)
                until you cancel. You can cancel anytime under Profile → Plan details → Manage subscription;
                Solo stays active until the end of the month you paid for. No refunds for partial months.
                By upgrading you agree to the{" "}
                <a href="/terms" target="_blank" className="text-accent underline">Terms of Service</a>.
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground mt-3 text-center">Online payments are being set up - check back soon.</p>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div className="text-center space-y-2 pt-2">
          <p className="text-xs text-muted-foreground">
            No commitment · Cancel anytime
          </p>
          <p className="text-xs text-muted-foreground">
            Payments are processed securely by Stripe
          </p>
        </div>
      </main>
    </div>
  );
}
