/**
 * How a template looks in lists, keyed by its `icon` name: the emoji tile,
 * the tinted badge (color + short trade label) and the dot in report history.
 * One table for the template picker, the home screen and the history.
 */
interface TemplateLook {
  emoji: string;
  color: string;
  dot: string;
  label: string;
}

const LOOKS: Record<string, TemplateLook> = {
  Wind: { emoji: "❄️", color: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300", dot: "bg-blue-500", label: "HVAC" },
  Snowflake: { emoji: "🧊", color: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300", dot: "bg-sky-500", label: "REFRIGERANT" },
  Flame: { emoji: "🔥", color: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300", dot: "bg-orange-500", label: "HEATING" },
  Droplets: { emoji: "💧", color: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300", dot: "bg-cyan-500", label: "PLUMBING" },
  FireExtinguisher: { emoji: "🧯", color: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300", dot: "bg-red-500", label: "FIRE" },
  ShowerHead: { emoji: "🚿", color: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300", dot: "bg-rose-500", label: "SPRINKLER" },
  BellRing: { emoji: "🔔", color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300", dot: "bg-amber-500", label: "ALARM" },
  ChefHat: { emoji: "🍳", color: "bg-lime-50 text-lime-700 dark:bg-lime-950 dark:text-lime-300", dot: "bg-lime-500", label: "KITCHEN" },
  Fan: { emoji: "🌀", color: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300", dot: "bg-teal-500", label: "EXHAUST" },
  Bug: { emoji: "🐜", color: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300", dot: "bg-green-500", label: "PEST" },
  KeyRound: { emoji: "🔑", color: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300", dot: "bg-purple-500", label: "RENTAL" },
  ClipboardList: { emoji: "📋", color: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300", dot: "bg-slate-500", label: "GENERAL" },
  // icons a custom template can still carry
  Zap: { emoji: "⚡", color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300", dot: "bg-amber-500", label: "ELECTRIC" },
  Home: { emoji: "🏠", color: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300", dot: "bg-purple-500", label: "PROPERTY" },
  ShieldAlert: { emoji: "🧯", color: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300", dot: "bg-red-500", label: "FIRE" },
  Sun: { emoji: "☀️", color: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300", dot: "bg-yellow-500", label: "SOLAR" },
  FileText: { emoji: "📄", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", dot: "bg-emerald-500", label: "" },
};

const pick = (key: keyof TemplateLook): Record<string, string> =>
  Object.fromEntries(Object.entries(LOOKS).map(([icon, look]) => [icon, look[key]]));

export const INDUSTRY_EMOJI = pick("emoji");
export const BADGE_COLORS = pick("color");
export const INDUSTRY_DOTS = pick("dot");
export const BADGE_LABELS = pick("label");
