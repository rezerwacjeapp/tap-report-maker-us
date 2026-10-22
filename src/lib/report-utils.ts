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

/** Timestamp "2026-10-22T16:05:00.000Z" → "10/22/2026 11:05 AM CDT" in this device's time zone. */
export function formatDateTimeUS(timestamp: string): string {
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return timestamp;
  const date = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
  const h = d.getHours();
  const time = `${h % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  let zone = "";
  try {
    zone = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" }).formatToParts(d).find((p) => p.type === "timeZoneName")?.value || "";
  } catch { /* no Intl time zone support - print without it */ }
  return `${date} ${time}${zone ? ` ${zone}` : ""}`;
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
  f.id === "f_protocol_nr" || /(report|protocol|work order|job|ticket|inspection|estimate)\s*(no\.?|number|#)/i.test(f.label);
const isResult = (f: CustomFieldDef) =>
  f.id === "f_result" || /^\s*(result|overall|assessment|pass\s*\/\s*fail|inspection result)/i.test(f.label);
/** Labels of things that belong to one visit - findings, readings, times, amounts. Used for
 *  custom templates, whose fields carry no `reuse` flag. */
const isVisitSpecific = (label: string) =>
  /\b(results?|overall|assessment|pass|fail|findings?|deficienc\w*|recommend\w*|repairs?|notes?|comments?|observations?|work (performed|done)|description of work|readings?|measured|times?|hours|amounts?|quantity|qty)\b/i.test(label);

export interface ReuseResult {
  draft: ReportDraft;
  /** Field ids filled from the old report — shown as "from last report" until edited. */
  copiedIds: string[];
}

/**
 * "New from this one": copies customer, site and equipment data into a fresh draft.
 * Readings, results and findings never carry over - an old reading on a new report
 * would look like a new measurement.
 *  - "remember" fields (technician, licenses, test instruments): this device's remembered values
 *  - reuse: false → starts empty; reuse: true → copied (nameplate data, sizes, types)
 *  - not marked: text and long text copied (except report numbers, results, findings, times…), numbers start empty
 *  - reuseFrom: filled with the old value of another field (e.g. previous main drain reading)
 *  - dates: report date = today, next date = empty, other dates copied
 *  - tables: reuse: false → fresh; otherwise rows keep text columns and columns marked reuse: true
 *  - checklists, photos, signatures, extra notes: start empty
 *  - "Previous recommendations" ← previous notes (f_notes → f_prev_recommendations)
 */
export function buildReuseDraft(fields: CustomFieldDef[], base: ReportDraft, old: Partial<ReportDraft>): ReuseResult {
  const oldValues = old.customFields || {};
  const cf = { ...base.customFields };
  const copied: string[] = [];
  const mainDate = mainDateFieldId(fields);
  const ids = new Set(fields.map((f) => f.id));
  const mapNotes = ids.has("f_prev_recommendations") && ids.has("f_notes");
  const filled = (v: unknown): v is string => typeof v === "string" && !!v.trim();

  for (const f of fields) {
    const from = f.reuseFrom ? oldValues[f.reuseFrom] : undefined;
    if (filled(from) && !from.startsWith('{"t":1')) {
      cf[f.id] = from;
      copied.push(f.id);
      continue;
    }

    const prev = oldValues[f.id];
    if (!filled(prev)) continue;
    if (f.remember || f.reuse === false) continue;
    if (mapNotes && (f.id === "f_notes" || f.id === "f_prev_recommendations")) continue;

    if (f.type === "text" || f.type === "textarea" || f.type === "number") {
      if (f.reuse !== true) {
        if (f.type === "number") continue;
        if (isProtocolNumber(f) || isResult(f) || isVisitSpecific(f.label)) continue;
      }
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
      // keep identifiers: text columns and columns marked reuse: true; drop readings, results and choices
      const keep = cols
        .filter((c) => (c.reuse !== undefined ? c.reuse : (!c.kind || c.kind === "text") && !isVisitSpecific(c.label)))
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
