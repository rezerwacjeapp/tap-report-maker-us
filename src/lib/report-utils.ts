import type { CustomFieldDef, ReportDraft, ReportHistoryItem } from "./storage";
import { parseTable, serializeTable, tableColumns, colsSnapshot, filledRows, initialTableValue, newRowKey, type TableRow } from "./table-field";

// ─── Dates ───────────────────────────────────────────────────

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const isISODate = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);

/**
 * "2026-10-09" as a local date. `new Date("2026-10-09")` is UTC midnight, which in
 * US time zones is still the previous day - so a report dated Oct 9 would show Oct 8.
 */
export function parseLocalDate(value: string): Date {
  if (isISODate(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
}

/** "Next inspection date", "Next service due"… */
export const isNextDateLabel = (label: string) => /\bnext\b/i.test(label);

export function addMonthsISO(iso: string, months: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(y, m - 1 + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(d, lastDay));
  return `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}-${String(target.getDate()).padStart(2, "0")}`;
}

/** The protocol's own date = first date field that is not a "next" date. Defaults to today. */
export function mainDateFieldId(fields: CustomFieldDef[]): string | undefined {
  return fields.find((f) => f.type === "date" && !isNextDateLabel(f.label))?.id;
}

export function daysBetween(fromISO: string, toISO: string): number {
  const [a, b] = [fromISO, toISO].map((s) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d); });
  return Math.round((b - a) / 86_400_000);
}

/** ISO "2026-10-09" → US "10/09/2026". Anything else is returned unchanged. */
export function formatDateUS(iso: string): string {
  if (!isISODate(iso)) return iso;
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
}

// ─── Upcoming inspections (from report history) ─────────────

export interface InspectionReminder {
  reportId: string;
  clientName: string;
  address?: string;
  phone?: string;
  templateName: string;
  dueDate: string;
  daysLeft: number;
}

const norm = (s?: string) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();

function findValueByLabel(item: ReportHistoryItem, re: RegExp): string | undefined {
  for (const [id, label] of Object.entries(item.fieldLabels || {})) {
    if (re.test(label)) {
      const v = item.customFields?.[id];
      if (typeof v === "string" && v.trim() && !v.startsWith('{"t":1')) return v.trim();
    }
  }
  return undefined;
}

/**
 * Next-inspection dates the technician typed into protocols, newest report per
 * client + template wins (so an inspection already redone disappears).
 * Returns items due within `horizonDays` and overdue ones up to `overdueDays`.
 */
export function computeReminders(history: ReportHistoryItem[], today = todayISO(), horizonDays = 60, overdueDays = 120): InspectionReminder[] {
  const sorted = [...history].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const seen = new Set<string>();
  const out: InspectionReminder[] = [];
  for (const item of sorted) {
    const address = findValueByLabel(item, /address/i);
    const key = `${norm(item.templateName)}|${norm(item.clientName)}|${norm(address)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const nextEntry = Object.entries(item.fieldLabels || {}).find(([id, label]) => isNextDateLabel(label) && isISODate(item.customFields?.[id]));
    if (!nextEntry) continue;
    const dueDate = item.customFields[nextEntry[0]];
    const daysLeft = daysBetween(today, dueDate);
    if (daysLeft > horizonDays || daysLeft < -overdueDays) continue;
    out.push({
      reportId: item.id,
      clientName: item.clientName && item.clientName !== "—" && item.clientName !== "-" ? item.clientName : (address || item.filename),
      address,
      phone: findValueByLabel(item, /phone/i)?.replace(/[^\d+]/g, ""),
      templateName: item.templateName,
      dueDate,
      daysLeft,
    });
  }
  return out.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export function reminderWhen(daysLeft: number): string {
  if (daysLeft < 0) {
    const n = -daysLeft;
    return n === 1 ? "1 day overdue" : `${n} days overdue`;
  }
  if (daysLeft === 0) return "today";
  if (daysLeft === 1) return "tomorrow";
  return `in ${daysLeft} days`;
}

// ─── "New from this one" — start a new report from an old one ───

const isProtocolNumber = (f: CustomFieldDef) =>
  f.id === "f_protocol_nr" || /(report|protocol|work order|job|ticket|inspection)\s*(no\.?|number|#)/i.test(f.label);
const isResult = (f: CustomFieldDef) =>
  f.id === "f_result" || /^\s*(result|overall|assessment|pass\s*\/\s*fail|inspection result)/i.test(f.label);

export interface ReuseResult {
  draft: ReportDraft;
  /** Field ids filled from the old report — shown as "from last report" until edited. */
  copiedIds: string[];
}

/**
 * Copies client/object/device data into a fresh draft.
 *  - text, long text, number: copied (except protocol number and result/assessment fields)
 *  - dates: protocol date = today, next-inspection date = empty, other dates copied
 *  - tables: rows kept with identifying columns — measured numbers and assessments are cleared
 *  - activities, photos, signatures, extra notes: start empty
 *  - "Previous recommendations" ← previous notes (starter templates: f_notes → f_prev_recommendations)
 */
export function buildReuseDraft(fields: CustomFieldDef[], base: ReportDraft, old: Partial<ReportDraft>): ReuseResult {
  const oldValues = old.customFields || {};
  const cf = { ...base.customFields };
  const copied: string[] = [];
  const mainDate = mainDateFieldId(fields);
  const ids = new Set(fields.map((f) => f.id));
  const mapNotes = ids.has("f_prev_recommendations") && ids.has("f_notes");

  for (const f of fields) {
    const prev = oldValues[f.id];
    if (typeof prev !== "string" || !prev.trim()) continue;

    if (f.type === "text" || f.type === "textarea" || f.type === "number") {
      if (isProtocolNumber(f) || isResult(f)) continue;
      if (mapNotes && (f.id === "f_notes" || f.id === "f_prev_recommendations")) continue;
      cf[f.id] = prev;
      copied.push(f.id);
    } else if (f.type === "date") {
      if (f.id === mainDate || isNextDateLabel(f.label)) continue;
      cf[f.id] = prev;
      copied.push(f.id);
    } else if (f.type === "table") {
      const tv = parseTable(prev);
      if (!tv) continue;
      const cols = tableColumns(f, tv);
      // keep identifiers (text, non-assessment choices like "Type A/B/C"); drop measurements and assessments
      const keep = cols
        .filter((c) => !c.kind || c.kind === "text" || (c.kind === "choice" && !/result|assess|pass|fail|condition|status|\bok\b/i.test(c.label)))
        .map((c) => c.id);
      const rows: TableRow[] = filledRows(tv, f)
        .map((r) => {
          const row: TableRow = { _k: newRowKey() };
          keep.forEach((id) => { if (r[id]?.trim()) row[id] = r[id]; });
          return row;
        })
        .filter((r) => Object.keys(r).length > 1);
      if (rows.length) {
        cf[f.id] = serializeTable({ cols: colsSnapshot(cols), rows });
        copied.push(f.id);
      } else {
        cf[f.id] = initialTableValue(f);
      }
    }
  }

  if (mapNotes && typeof oldValues.f_notes === "string" && oldValues.f_notes.trim()) {
    cf.f_prev_recommendations = oldValues.f_notes;
    copied.push("f_prev_recommendations");
  }

  return { draft: { ...base, customFields: cf }, copiedIds: copied };
}
