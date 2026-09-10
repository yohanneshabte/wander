import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { recordVisit } from "@/lib/spa/store";

/** HTML5 visit ping on every public page, including the printed QR URL. */
export function VisitBeacon() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    recordVisit(pathname);
  }, [pathname]);
  return null;
}
