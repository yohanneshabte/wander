/** Device-only storage for the personal dashboard. localStorage, nothing sent to the server. */
import { useCallback, useEffect, useState } from "react";
import { CREDITS_DEFAULT, HSA_TARGET_DEFAULT, MEMBERSHIP_DEFAULT } from "./config";
import type { CreditUse, Gear, HsaSpend, PanelTest, Planned, SaunaSession } from "./calc";

const KEY = "wander-personal-v1";

/** Only counts, dates, venues, gear, temps/minutes, and amounts. No health fields by design. */
export type PersonalData = {
  sessions: SaunaSession[];
  panelTests: PanelTest[];
  planned: Planned[];
  gear: Gear[];
  hsa: HsaSpend[];
  hsaTarget: number;
  credits: { label: string; total: number; used: CreditUse[] };
  membership: { label: string; venueName: string; monthlyPrice: number };
};

export const EMPTY: PersonalData = {
  sessions: [],
  panelTests: [],
  planned: [],
  gear: [],
  hsa: [],
  hsaTarget: HSA_TARGET_DEFAULT,
  credits: { ...CREDITS_DEFAULT, used: [] },
  membership: { ...MEMBERSHIP_DEFAULT },
};

function read(): PersonalData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<PersonalData>;
    return {
      ...EMPTY,
      ...parsed,
      credits: { ...EMPTY.credits, ...parsed.credits },
      membership: { ...EMPTY.membership, ...parsed.membership },
    };
  } catch {
    return EMPTY;
  }
}

export function usePersonal() {
  const [data, setData] = useState<PersonalData>(EMPTY);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setData(read());
    setReady(true);
  }, []);
  const update = useCallback((fn: (d: PersonalData) => PersonalData) => {
    setData((cur) => {
      const next = fn(cur);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage full or blocked; keep in memory */
      }
      return next;
    });
  }, []);
  const clearAll = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setData(EMPTY);
  }, []);
  return { data, update, ready, clearAll };
}

export function downloadText(filename: string, text: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
