export type VisitPing = {
  path: string;
  sessionId: string;
  siteId: string;
  device: string;
  os: string;
  browser: string;
  screen: string;
  viewport: string;
  dpr: number;
  lang: string;
  tz: string;
  touch: number;
  connection: string;
  referrer: string;
  ua: string;
};

const SID = "spa-visit-sid";

function clip(value: string, n: number) {
  return value.replace(/\s+/g, " ").trim().slice(0, n);
}

function readHouse() {
  try {
    return sessionStorage.getItem("spa-house-pick") || "watercourse";
  } catch {
    return "watercourse";
  }
}

function readSessionId() {
  try {
    let id = sessionStorage.getItem(SID);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SID, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

function parseUa(ua: string) {
  const device = /iPhone/i.test(ua)
    ? "iPhone"
    : /iPad/i.test(ua)
      ? "iPad"
      : /Android/i.test(ua)
        ? "Android"
        : /Macintosh|Mac OS X/i.test(ua)
          ? "Mac"
          : /Windows/i.test(ua)
            ? "Windows"
            : /CrOS/i.test(ua)
              ? "Chromebook"
              : /Linux/i.test(ua)
                ? "Linux"
                : "Other";
  const os = /iPhone|iPad|iPod/i.test(ua)
    ? "iOS"
    : /Android/i.test(ua)
      ? "Android"
      : /Mac OS X/i.test(ua)
        ? "macOS"
        : /Windows/i.test(ua)
          ? "Windows"
          : "Other";
  const browser = /Edg\//i.test(ua)
    ? "Edge"
    : /OPR\/|Opera/i.test(ua)
      ? "Opera"
      : /Chrome\//i.test(ua)
        ? "Chrome"
        : /Safari\//i.test(ua)
          ? "Safari"
          : /Firefox\//i.test(ua)
            ? "Firefox"
            : "Other";
  return { device, os, browser };
}

type NetInfo = {
  effectiveType?: string;
  downlink?: number;
};

export function snapshotVisit(path: string): VisitPing | null {
  if (typeof window === "undefined") return null;
  const nav = navigator;
  const ua = nav.userAgent || "";
  const parsed = parseUa(ua);
  const net = (nav as Navigator & { connection?: NetInfo }).connection;
  const conn = net?.effectiveType
    ? net.downlink
      ? `${net.effectiveType} · ${net.downlink}Mb`
      : net.effectiveType
    : "";
  return {
    path,
    sessionId: readSessionId(),
    siteId: readHouse(),
    device: parsed.device,
    os: parsed.os,
    browser: parsed.browser,
    screen: `${screen.width}×${screen.height}`,
    viewport: `${window.innerWidth}×${window.innerHeight}`,
    dpr: Number(window.devicePixelRatio || 1),
    lang: clip(nav.language || "", 24),
    tz: clip(Intl.DateTimeFormat().resolvedOptions().timeZone || "", 64),
    touch: Number(nav.maxTouchPoints || 0),
    connection: clip(conn, 32),
    referrer: clip(document.referrer || "", 180),
    ua: clip(ua, 240),
  };
}
