import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronRight, Zap, Clock, X, LogOut, MessageCircle, CalendarClock, MessageSquareText, Loader2 } from "lucide-react";
import type { ReportHistoryItem } from "@/lib/storage";
import { getUserTemplates, fetchUserTemplates, STARTER_TEMPLATES, type ReportTemplate } from "@/lib/templates";
import {
  checkReportLimit, getCloudDrafts, deleteCloudDraft, getCloudReportHistory, getCloudProfile, type CloudDraft,
} from "@/lib/supabase-storage";
import { computeReminders, reminderWhen, formatDateUS, parseLocalDate, type InspectionReminder } from "@/lib/report-utils";
import { INDUSTRY_EMOJI, BADGE_COLORS, INDUSTRY_DOTS } from "@/lib/template-style";
import { prepareReuse } from "@/lib/reuse-report";
import { BrandLockup } from "@/components/BrandLogo";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { SUPPORT_EMAIL } from "@/lib/site";

const HIDDEN_STARTERS_KEY = "raporton_hidden_starters";
const QUICK_START_KEY = "raporton_quick_start";

function getHiddenStarters(): Set<string> {
  try {
    const raw = localStorage.getItem(HIDDEN_STARTERS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function getQuickStartIds(): Set<string> {
  try {
    const raw = localStorage.getItem(QUICK_START_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

const Index = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  // Reports and profile live in Supabase (the old localStorage history is no longer written)
  const [reports, setReports] = useState<ReportHistoryItem[]>([]);
  const [reportsLoaded, setReportsLoaded] = useState(false);
  const [hasProfile, setHasProfile] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [reuseBusy, setReuseBusy] = useState<string | null>(null);
  const recentReports = reports.slice(0, 3);
  const reminders = useMemo(() => computeReminders(reports), [reports]);

  const [planInfo, setPlanInfo] = useState<{ count: number; limit: number; plan: string; trial?: boolean; trialDaysLeft?: number } | null>(null);
  const [cloudDrafts, setCloudDrafts] = useState<CloudDraft[]>([]);
  const [userTemplates, setUserTemplates] = useState<ReportTemplate[]>(getUserTemplates);

  useEffect(() => {
    checkReportLimit()
      .then((info) => setPlanInfo({ count: info.count, limit: info.limit, plan: info.plan, trial: info.trial, trialDaysLeft: info.trialDaysLeft }))
      .catch(() => {});
    getCloudDrafts().then(setCloudDrafts).catch(() => {});
    fetchUserTemplates().then(setUserTemplates).catch(() => {});
    getCloudReportHistory().then(setReports).catch(() => {}).finally(() => setReportsLoaded(true));
    getCloudProfile()
      .then((p) => {
        setHasProfile(!!p.logo || !!p.fields?.some((f) => f.value?.trim()));
        setCompanyName(p.fields?.[0]?.value?.trim() || "");
      })
      .catch(() => {});
  }, []);

  const startNextInspection = async (r: InspectionReminder) => {
    const report = reports.find((x) => x.id === r.reportId);
    if (!report || reuseBusy) return;
    setReuseBusy(r.reportId);
    try {
      const url = await prepareReuse(report);
      if (url) navigate(url);
      else toast.error("The template for this report no longer exists.");
    } finally {
      setReuseBusy(null);
    }
  };

  const smsHref = (r: InspectionReminder) => {
    const body = `Hi, a quick reminder that your next service (${r.templateName}) is due on ${formatDateUS(r.dueDate)}. When would be a good time to schedule it?${companyName ? ` - ${companyName}` : ""}`;
    return `sms:${r.phone}?&body=${encodeURIComponent(body)}`;
  };

  const handleDeleteDraft = (id: string) => {
    deleteCloudDraft(id).catch(() => {});
    setCloudDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  const hiddenStarters = getHiddenStarters();
  const quickStartIds = getQuickStartIds();
  const userTemplateCount = userTemplates.length;

  const quickStartTemplates: { id: string; name: string; icon: string }[] = [];
  if (quickStartIds.size > 0) {
    const allTemplates = [...userTemplates, ...STARTER_TEMPLATES];
    for (const t of allTemplates) {
      if (quickStartIds.has(t.id)) {
        quickStartTemplates.push({ id: t.id, name: t.name, icon: t.icon });
      }
    }
  } else {
    STARTER_TEMPLATES
      .filter((s) => !hiddenStarters.has(s.id))
      .slice(0, 4)
      .forEach((s) => quickStartTemplates.push({ id: s.id, name: s.name, icon: s.icon }));
  }

  const formatDate = (dateStr: string) => {
    try {
      return parseLocalDate(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric",
      });
    } catch { return dateStr; }
  };

  const getTemplateIcon = (templateName: string) => {
    const starter = STARTER_TEMPLATES.find((s) => s.name === templateName);
    return starter?.icon || "FileText";
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "just now";
      if (mins < 60) return `${mins} min ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} hr ago`;
      const days = Math.floor(hours / 24);
      if (days === 1) return "yesterday";
      return `${days} days ago`;
    } catch { return ""; }
  };

  // Plan bar: free / trial users see it right under "New report" (with "Upgrade to Solo"),
  // Solo users keep it lower on the page.
  const planBar = planInfo && (
    <div className="rounded-2xl glass-card p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            {planInfo.plan === "solo" ? "Solo plan" : planInfo.plan === "trial" ? "Free trial" : "Free plan"}
          </span>
          {planInfo.plan === "trial" && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold whitespace-nowrap">
              {planInfo.trialDaysLeft} {planInfo.trialDaysLeft === 1 ? "day" : "days"} left
            </span>
          )}
          {planInfo.plan === "free" && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-semibold whitespace-nowrap">
              with watermark
            </span>
          )}
        </div>
        {(planInfo.plan === "free" || planInfo.plan === "trial") && (
          <button
            onClick={() => navigate("/upgrade")}
            className="shrink-0 flex items-center gap-1 text-xs font-medium text-accent hover:underline whitespace-nowrap"
          >
            <Zap className="h-3 w-3" />
            Upgrade to Solo
          </button>
        )}
      </div>

      {planInfo.plan === "trial" ? (
        <p className="text-[11px] text-muted-foreground">
          Full access for 7 days - reports without a watermark. After that: unlimited reports with a watermark, or Solo without one.
        </p>
      ) : planInfo.plan === "free" ? (
        <p className="text-[11px] text-muted-foreground">
          Unlimited reports. Every PDF carries a "RaportON.com" watermark. Upgrade to Solo to remove it.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Unlimited reports, no watermark
        </p>
      )}
    </div>
  );

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="px-5 pt-8 pb-2 flex items-start justify-between">
        <div>
          <h1 className="sr-only">RaportON</h1>
          <BrandLockup markClassName="h-8 w-auto" textClassName="text-2xl" />
          <p className="text-sm text-muted-foreground mt-1">Service reports in a minute</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-xl px-2.5 py-2 text-muted-foreground hover:text-accent glass-card hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all"
            title="Contact"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <button
            onClick={async () => { await signOut(); navigate("/login"); }}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs text-muted-foreground hover:text-destructive glass-card hover:bg-red-50/50 dark:hover:bg-red-950/30 transition-all"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-5 py-4 space-y-5">
        {/* Hero — New Report */}
        <button
          onClick={() => navigate("/select-template")}
          className="w-full rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-5 text-left text-white shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Plus className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">New report</h2>
              <p className="text-sm text-white/75 mt-0.5">Pick a template and fill it in</p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/60" />
          </div>
        </button>

        {/* Plan bar (Free / trial) - "Upgrade to Solo" right under "New report" */}
        {planInfo && planInfo.plan !== "solo" && planBar}

        {/* Saved drafts */}
        {cloudDrafts.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
              Unfinished reports
            </p>
            <div className="rounded-2xl glass-card overflow-hidden" style={{ borderColor: 'rgba(245, 158, 11, 0.2)' }}>
              {cloudDrafts.map((d, i) => {
                const icon = getTemplateIcon(d.templateName);
                const emoji = INDUSTRY_EMOJI[icon] || "📄";
                const timeAgo = formatRelativeTime(d.updatedAt);
                return (
                  <div
                    key={d.id}
                    className={`flex items-center gap-3 px-4 py-3.5 ${i < cloudDrafts.length - 1 ? "border-b border-border/50" : ""}`}
                  >
                    <button
                      onClick={() => navigate(`/report?template=${d.templateId}&draft=${d.id}`)}
                      className="flex items-center gap-3 flex-1 min-w-0 text-left"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-sm shrink-0">
                        {emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {d.label || d.templateName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[11px] text-muted-foreground">{timeAgo}</span>
                          {d.label && <span className="text-[11px] text-muted-foreground">• {d.templateName}</span>}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </button>
                    <button
                      onClick={() => handleDeleteDraft(d.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive shrink-0 transition-colors"
                      title="Delete draft"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming inspections — from "Next ... date" fields in past reports */}
        {reminders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5" /> Upcoming inspections
              </p>
              <span className="text-[11px] text-muted-foreground">{reminders.length}</span>
            </div>
            <div className="rounded-2xl glass-card overflow-hidden">
              {reminders.slice(0, 5).map((r, i) => {
                const overdue = r.daysLeft < 0;
                const soon = r.daysLeft >= 0 && r.daysLeft <= 14;
                return (
                  <div key={r.reportId} className={`px-4 py-3.5 ${i < Math.min(reminders.length, 5) - 1 ? "border-b border-border/50" : ""}`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{r.clientName}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{r.templateName} • {formatDateUS(r.dueDate)}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${overdue ? "bg-red-500/10 text-red-600 dark:text-red-400" : soon ? "bg-amber-500/15 text-amber-700 dark:text-amber-300" : "bg-muted text-muted-foreground"}`}>
                        {reminderWhen(r.daysLeft)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2.5">
                      <button
                        onClick={() => startNextInspection(r)}
                        disabled={reuseBusy === r.reportId}
                        className="h-8 rounded-lg bg-accent/10 text-accent px-3 text-xs font-semibold flex items-center gap-1.5 hover:bg-accent/15 transition-colors disabled:opacity-60"
                      >
                        {reuseBusy === r.reportId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />} New report
                      </button>
                      {r.phone && (
                        <a
                          href={smsHref(r)}
                          className="h-8 rounded-lg border border-border px-3 text-xs font-medium flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <MessageSquareText className="h-3.5 w-3.5" /> Text a reminder
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl glass-card p-3.5">
            <p className="text-xl font-semibold">{reportsLoaded ? (reports.length >= 100 ? "100+" : reports.length) : "…"}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Reports</p>
          </div>
          <div className="rounded-2xl glass-card p-3.5">
            <p className="text-xl font-semibold">{userTemplateCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Templates</p>
          </div>
          <div className="rounded-2xl glass-card p-3.5">
            <p className="text-xl font-semibold">
              {reports.length > 0 ? formatDate(reports[0].date) : "-"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Latest</p>
          </div>
        </div>

        {/* Plan bar (Solo) */}
        {planInfo?.plan === "solo" && planBar}

        {/* Recent reports */}
        {recentReports.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Recent reports
              </p>
              <button onClick={() => navigate("/reports")} className="text-xs text-accent font-medium">
                See all
              </button>
            </div>
            <div className="rounded-2xl glass-card overflow-hidden">
              {recentReports.map((report, i) => {
                const icon = getTemplateIcon(report.templateName);
                const dotColor = INDUSTRY_DOTS[icon] || "bg-accent";
                return (
                  <button
                    key={report.id}
                    onClick={() => navigate("/reports")}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/40 dark:hover:bg-white/5 transition-colors active:bg-white/50 ${i < recentReports.length - 1 ? "border-b border-border/50" : ""}`}
                  >
                    <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {report.clientName && report.clientName !== "—" && report.clientName !== "-" ? report.clientName : report.filename}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-muted-foreground">{formatDate(report.date)}</span>
                        <span className="text-[11px] text-muted-foreground">•</span>
                        <span className="text-[11px] text-accent font-medium">{report.templateName}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick start */}
        {quickStartTemplates.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
              Quick start
            </p>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
              {quickStartTemplates.map((tmpl) => {
                const colorCls = BADGE_COLORS[tmpl.icon] || "bg-muted text-muted-foreground";
                const emoji = INDUSTRY_EMOJI[tmpl.icon] || "📄";
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => navigate(`/report?template=${tmpl.id}`)}
                    className="flex flex-col items-center gap-2 rounded-2xl glass-card p-3.5 min-w-[100px] hover:shadow-md transition-all active:scale-[0.97]"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-base ${colorCls}`}>
                      {emoji}
                    </div>
                    <span className="text-[11px] font-medium text-center">{tmpl.name.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Profile hint */}
        {!hasProfile && (
          <div className="rounded-2xl glass-card p-4" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <p className="text-sm">
              <strong>Tip:</strong> Fill in your{" "}
              <span className="text-accent font-semibold cursor-pointer" onClick={() => navigate("/profile")}>
                company profile
              </span>
              so your details appear on every report automatically.
            </p>
          </div>
        )}

        {/* Template request banner */}
        <div className="rounded-2xl glass-card p-4" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
          <p className="text-sm">
            <strong>Need a template?</strong> Send us a sample of your report at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent font-semibold">{SUPPORT_EMAIL}</a>{" "}
            and we'll build the template for you.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 py-3 text-center">
        <p className="text-[11px] text-muted-foreground">RaportON v2.0</p>
      </footer>
    </div>
  );
};

export default Index;
