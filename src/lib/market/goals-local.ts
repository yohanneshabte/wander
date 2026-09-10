const GOALS_KEY = "wander-goals";
const WEEK_KEY = "wander-week";

export function readGoals(): string[] {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
  } catch {
    return [];
  }
}

export function writeGoals(goals: string[]) {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals.slice(0, 6)));
    window.dispatchEvent(new Event("wander-goals"));
  } catch {
    /* ignore */
  }
}

export function toggleGoal(key: string) {
  const cur = new Set(readGoals());
  if (cur.has(key)) cur.delete(key);
  else cur.add(key);
  writeGoals([...cur]);
  return [...cur];
}

type WeekHit = { date: string; tag: string };

export function noteWeekHit(tag: string, date: string) {
  try {
    const raw = localStorage.getItem(WEEK_KEY);
    const parsed = raw ? (JSON.parse(raw) as WeekHit[]) : [];
    const rows = Array.isArray(parsed) ? parsed : [];
    rows.push({ date, tag });
    localStorage.setItem(WEEK_KEY, JSON.stringify(rows.slice(-40)));
    window.dispatchEvent(new Event("wander-goals"));
  } catch {
    /* ignore */
  }
}

export function weekCount(tag: string) {
  try {
    const raw = localStorage.getItem(WEEK_KEY);
    const parsed = raw ? (JSON.parse(raw) as WeekHit[]) : [];
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return parsed.filter((h) => h.tag === tag && new Date(h.date).getTime() >= cutoff).length;
  } catch {
    return 0;
  }
}
