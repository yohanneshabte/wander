import { useEffect, useState } from "react";
import { create } from "zustand";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  claimDesk,
  createBooking,
  getMyProfile,
  listMyBookings,
  listOccupancy,
  listStaffBookings,
  markBookingLate,
  pingVisit,
  type NewBooking,
  type Profile,
  type SpaRole,
  type StaffBooking,
} from "./api";
import { claimStore } from "@/lib/market/api";
import { snapshotVisit } from "./device";
import type { Booking } from "./engine";
import { useHouse } from "@/lib/platform/store";

const tick = create<{ n: number; bump: () => void }>((set) => ({
  n: 0,
  bump: () => set((s) => ({ n: s.n + 1 })),
}));

export function refreshSpa() {
  tick.getState().bump();
}

export function useAllBookings() {
  const n = tick((s) => s.n);
  const house = useHouse();
  const [rows, setRows] = useState<Booking[]>([]);
  useEffect(() => {
    let alive = true;
    listOccupancy({ data: { siteId: house.site.id } })
      .then((r) => {
        if (alive) setRows(r);
      })
      .catch(() => {
        if (alive) setRows([]);
      });
    return () => {
      alive = false;
    };
  }, [n, house.site.id]);
  return rows;
}

export function useStaffBookings() {
  const n = tick((s) => s.n);
  const { user } = useCurrentUserState();
  const [rows, setRows] = useState<StaffBooking[]>([]);
  useEffect(() => {
    if (!user) {
      setRows([]);
      return;
    }
    let alive = true;
    listStaffBookings()
      .then((r) => {
        if (alive) setRows(r);
      })
      .catch(() => {
        if (alive) setRows([]);
      });
    return () => {
      alive = false;
    };
  }, [n, user?.id]);
  return rows;
}

export function useMyBookings() {
  const n = tick((s) => s.n);
  const { user } = useCurrentUserState();
  const [rows, setRows] = useState<StaffBooking[]>([]);
  useEffect(() => {
    if (!user) {
      setRows([]);
      return;
    }
    let alive = true;
    listMyBookings()
      .then((r) => {
        if (alive) setRows(r);
      })
      .catch(() => {
        if (alive) setRows([]);
      });
    return () => {
      alive = false;
    };
  }, [n, user?.id]);
  return rows;
}

export function useProfile() {
  const n = tick((s) => s.n);
  const { user, isPending } = useCurrentUserState();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setProfile(null);
      setReady(true);
      return;
    }
    let alive = true;
    setReady(false);
    getMyProfile()
      .then((p) => {
        if (!alive) return;
        setProfile(p);
        setReady(true);
      })
      .catch(() => {
        if (!alive) return;
        setProfile(null);
        setReady(true);
      });
    return () => {
      alive = false;
    };
  }, [n, user?.id, isPending]);

  const role: SpaRole = profile?.role ?? "customer";
  return { profile, role, ready };
}

export async function addBooking(input: NewBooking) {
  const saved = await createBooking({ data: input });
  refreshSpa();
  return saved;
}

export async function markLate(id: string, lateMinutes: number) {
  await markBookingLate({ data: { id, lateMinutes } });
  refreshSpa();
}

export async function joinDesk(code: string) {
  try {
    const profile = await claimDesk({ data: code });
    refreshSpa();
    return profile;
  } catch (err) {
    const store = await claimStore({ data: code });
    refreshSpa();
    return store;
  }
}

let lastPing = { path: "", at: 0 };

export function recordVisit(path: string) {
  const snap = snapshotVisit(path);
  if (!snap) return;
  const now = Date.now();
  if (snap.path === lastPing.path && now - lastPing.at < 2000) return;
  lastPing = { path: snap.path, at: now };
  pingVisit({ data: snap }).catch(() => {});
}
