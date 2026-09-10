import { useEffect } from "react";
import { usePlatform } from "@/lib/platform/store";

export function HouseTheme() {
  const { house } = usePlatform();
  useEffect(() => {
    document.documentElement.dataset.house = house.site.theme;
  }, [house.site.theme]);
  return null;
}
