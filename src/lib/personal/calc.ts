/** Pure helpers for the personal dashboard (testable, no DOM). */

export type SaunaSession = {
  id: string;
  date: string; // YYYY-MM-DD
  venue: string;
  tempF: number;
  minutes: number;
  coolDown: boolean;
};

export type PanelTest = {
  id: string;
  date: string;
  device: string;
  area: string;
  setting: string;
  minutes: number;
  skinCheck: boolean;
};

export type Planned = { id: string; date: string; time: string; title: string; venue: string };
export type Gear = { id: string; date: string; name: string; price: number; source: string };
export type HsaSpend = { id: string; date: string; amount: number; category: string };
export type CreditUse = { id: string; date: string };

export const uid = () => Math.random().toString(36).slice(2, 10);

export function monthKey(date: string) {
  return date.slice(0, 7);
}

/** Visits per month at a venue, newest month first. */
export function visitsByMonth(sessions: SaunaSession[], venue: string) {
  const counts = new Map<string, number>();
  for (const s of sessions) {
    if (s.venue.trim().toLowerCase() !== venue.trim().toLowerCase()) continue;
    const k = monthKey(s.date);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

export function costPerVisit(monthlyPrice: number, visits: number) {
  if (!visits || monthlyPrice <= 0) return null;
  return Math.round((monthlyPrice / visits) * 100) / 100;
}

export function creditsLeft(total: number, used: CreditUse[]) {
  return Math.max(0, total - used.length);
}

export function hsaYearTotal(rows: HsaSpend[], year: number) {
  return rows
    .filter((r) => r.date.startsWith(String(year)))
    .reduce((sum, r) => sum + (Number.isFinite(r.amount) ? r.amount : 0), 0);
}

/** Soft heat checks for one session; returns friendly reminders, never blocks. */
export function heatReminders(s: Pick<SaunaSession, "tempF" | "minutes" | "coolDown">, cap = 20) {
  const out: string[] = [];
  if (s.minutes > cap)
    out.push(`That's over the ${cap}-minute cap — next time, try a shorter round.`);
  if (!s.coolDown) out.push("Remember a cool-down after heat.");
  return out;
}

/** True when the last two logged heat days are back-to-back (nudge a rest day). */
export function needsRestDay(sessions: SaunaSession[]) {
  const days = [...new Set(sessions.map((s) => s.date))].sort().reverse();
  if (days.length < 2) return false;
  const diff = (Date.parse(days[0]) - Date.parse(days[1])) / 86_400_000;
  return diff <= 1;
}

function splitCsvLine(line: string) {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (q && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else q = !q;
    } else if (c === "," && !q) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function toIsoDate(raw: string) {
  const t = Date.parse(raw);
  if (Number.isNaN(t)) return raw.slice(0, 10);
  return new Date(t).toISOString().slice(0, 10);
}

/** Parse a pasted order CSV (e.g. an Amazon order export). Needs a header row with a name/title column. */
export function parseGearCsv(text: string): Omit<Gear, "id">[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const head = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const find = (...keys: string[]) => head.findIndex((h) => keys.some((k) => h.includes(k)));
  const iName = find("product name", "title", "item", "name");
  const iDate = find("order date", "date");
  const iPrice = find("total owed", "item total", "unit price", "price", "total", "amount");
  if (iName < 0) return [];
  return lines.slice(1).flatMap((line) => {
    const cols = splitCsvLine(line);
    const name = cols[iName];
    if (!name) return [];
    const price = iPrice >= 0 ? Number((cols[iPrice] || "").replace(/[^0-9.]/g, "")) : 0;
    return [
      {
        name,
        date: iDate >= 0 ? toIsoDate(cols[iDate] || "") : "",
        price: Number.isFinite(price) ? price : 0,
        source: "Amazon (CSV)",
      },
    ];
  });
}

function icsEscape(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** Build a plain .ics file. Floating local times; no calendar API. */
export function buildIcs(items: Planned[], minutes = 60) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wander//Personal 0.3 alpha//EN",
    "CALSCALE:GREGORIAN",
  ];
  for (const p of items) {
    const [y, m, d] = p.date.split("-").map(Number);
    const [hh, mm] = (p.time || "09:00").split(":").map(Number);
    const start = new Date(Date.UTC(y, m - 1, d, hh, mm));
    const end = new Date(start.getTime() + minutes * 60_000);
    const fmt = (t: Date) => t.toISOString().replace(/[-:]/g, "").slice(0, 15);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${p.id}@wander.local`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${icsEscape(p.title)}`,
      ...(p.venue ? [`LOCATION:${icsEscape(p.venue)}`] : []),
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

/** Month grid (Sunday-first) of YYYY-MM-DD strings, blanks as "". */
export function monthGrid(year: number, month0: number) {
  const first = new Date(Date.UTC(year, month0, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
  const cells: string[] = Array(first).fill("");
  for (let d = 1; d <= days; d++) {
    cells.push(`${year}-${String(month0 + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  }
  while (cells.length % 7) cells.push("");
  return cells;
}
