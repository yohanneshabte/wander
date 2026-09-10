import { useEffect, useState } from "react";
import { getPlatform, savePlatform } from "./api";
import { DEFAULT_SETTINGS, HOUSE_BY_ID, HOUSES } from "./catalog";
import type { HouseCatalog, PlatformSettings } from "./types";

const PICK_KEY = "spa-house-pick";

function readPick() {
  try {
    return sessionStorage.getItem(PICK_KEY);
  } catch {
    return null;
  }
}

export function setHousePick(id: string | null) {
  try {
    if (id) sessionStorage.setItem(PICK_KEY, id);
    else sessionStorage.removeItem(PICK_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("spa-house"));
}

export function usePlatform() {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [houses, setHouses] = useState<HouseCatalog[]>(HOUSES);
  const [pick, setPick] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPick(readPick());
    const on = () => setPick(readPick());
    window.addEventListener("spa-house", on);
    return () => window.removeEventListener("spa-house", on);
  }, []);

  useEffect(() => {
    let alive = true;
    getPlatform()
      .then((p) => {
        if (!alive) return;
        setSettings(p.settings);
        setHouses(p.houses);
        setReady(true);
      })
      .catch(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const guestId = settings.discoveryMode ? pick : null;
  const siteId = guestId || settings.previewSiteId || settings.liveSiteId;
  const house = HOUSE_BY_ID[siteId] ?? houses[0] ?? HOUSES[0];

  async function save(next: PlatformSettings) {
    const saved = await savePlatform({ data: next });
    setSettings(saved);
    return saved;
  }

  return { settings, houses, house, ready, save, pick: siteId };
}

export function useHouse(): HouseCatalog {
  return usePlatform().house;
}
