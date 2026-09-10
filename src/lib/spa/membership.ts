import {
  DAY_CUTOFF_MIN,
  LATE_FEE_USD,
  LATE_GRACE_MIN,
  ROOMS,
  SQUARE_CENTS,
  SQUARE_PERCENT,
} from "./rooms";
import { quotePrice } from "./engine";

export type MemberTierId = "none" | "weekday" | "anytime" | "house";
export type PaidVia = "desk" | "square";

export type MemberTier = {
  id: MemberTierId;
  name: string;
  tag: string;
  price: number;
  hours: number;
  extraTub: number;
  extraHeat: number;
  eveningIncluded: boolean;
  waiveLate: boolean;
  blurb: string;
};

export const MEMBER_TIERS: MemberTier[] = [
  {
    id: "weekday",
    name: "Weekday Soak",
    tag: "4 hours",
    price: 99,
    hours: 4,
    extraTub: 14,
    extraHeat: 18,
    eveningIncluded: false,
    waiveLate: false,
    blurb: "Four hours before 5:40pm. Extra day hours at the member rate. Fills the quiet morning rooms.",
  },
  {
    id: "anytime",
    name: "Anytime Soak",
    tag: "8 hours",
    price: 159,
    hours: 8,
    extraTub: 16,
    extraHeat: 20,
    eveningIncluded: true,
    waiveLate: false,
    blurb: "Eight hours any day, including evening. One late-fee waiver a month.",
  },
  {
    id: "house",
    name: "House Circle",
    tag: "Unlimited day",
    price: 199,
    hours: 16,
    extraTub: 18,
    extraHeat: 22,
    eveningIncluded: true,
    waiveLate: true,
    blurb: "Unlimited weekday day soaks, four evening hours, late fee waived, first hold on member rooms.",
  },
];

export const DROP_IN: MemberTier = {
  id: "none",
  name: "Drop-in",
  tag: "Per visit",
  price: 0,
  hours: 0,
  extraTub: 18,
  extraHeat: 23,
  eveningIncluded: true,
  waiveLate: false,
  blurb: "Day and evening rates, billed per person per hour.",
};

export function tierById(id: MemberTierId): MemberTier {
  if (id === "none") return DROP_IN;
  return MEMBER_TIERS.find((t) => t.id === id) ?? DROP_IN;
}

export function lateFeeFor(opts: {
  lateMinutes: number;
  memberTier: MemberTierId;
}) {
  if (opts.lateMinutes < LATE_GRACE_MIN) return 0;
  if (tierById(opts.memberTier).waiveLate) return 0;
  return LATE_FEE_USD;
}

export function squareTake(amount: number, txns = 1) {
  if (amount <= 0) return 0;
  return Math.round((amount * (SQUARE_PERCENT / 100) + (SQUARE_CENTS / 100) * txns) * 100) / 100;
}

export function priceVisit(opts: {
  startMin: number;
  durationMin: number;
  guests: number;
  withSauna: boolean;
  memberTier?: MemberTierId;
  lateMinutes?: number;
}) {
  const drop = quotePrice(opts);
  const tier = tierById(opts.memberTier ?? "none");
  const evening = opts.startMin >= DAY_CUTOFF_MIN;
  const hours = opts.durationMin / 60;

  let soak = drop.total;
  let covered = false;
  if (tier.id !== "none") {
    const eveningOk = !evening || tier.eveningIncluded;
    if (eveningOk && hours <= tier.hours) {
      soak = 0;
      covered = true;
    } else {
      const extra = opts.withSauna ? tier.extraHeat : tier.extraTub;
      soak = Math.round(extra * hours * opts.guests * 100) / 100;
    }
  }

  const late = lateFeeFor({
    lateMinutes: opts.lateMinutes ?? 0,
    memberTier: tier.id,
  });
  const due = Math.round((soak + late) * 100) / 100;
  return {
    ...drop,
    dropInTotal: drop.total,
    soak,
    covered,
    lateFee: late,
    due,
    squareFee: squareTake(due),
    net: Math.round((due - squareTake(due)) * 100) / 100,
    tier,
  };
}

export function soakMinutesLeft(durationMin: number, lateMinutes: number) {
  const late = Math.max(0, lateMinutes);
  return Math.max(0, durationMin - late);
}

export type CircleSim = {
  members: number;
  tierId: Exclude<MemberTierId, "none">;
  hoursUsed: number;
  extraHours: number;
  cannibalPct: number;
  latePct: number;
  roomIds: string[];
  walkInRevenue: number;
  costsPct: number;
};

export function simulateCircle(s: CircleSim) {
  const tier = tierById(s.tierId);
  const mrr = s.members * tier.price;
  const extraRev = s.members * s.extraHours * ((tier.extraTub + tier.extraHeat) / 2);
  const memberHours = s.members * (s.hoursUsed + s.extraHours);
  const cannibal = Math.min(
    s.walkInRevenue * (s.cannibalPct / 100),
    memberHours * 22,
  );
  const visits = s.members * Math.max(1, s.hoursUsed);
  const lateRev = tier.waiveLate
    ? 0
    : visits * (s.latePct / 100) * LATE_FEE_USD;
  const remainingWalkIn = Math.max(0, s.walkInRevenue - cannibal);
  const gross = remainingWalkIn + mrr + extraRev + lateRev;
  const txns = s.members + visits * 0.25;
  const square = squareTake(gross, txns);
  const todayGross = s.walkInRevenue;
  const todaySquare = squareTake(todayGross, 20 * 30);
  const todayNet = todayGross - todaySquare;
  const newNet = gross - square;
  const todayProfit = todayNet * (1 - s.costsPct / 100);
  const newProfit = newNet * (1 - s.costsPct / 100);
  const roomShare = s.roomIds.length / ROOMS.length || 1;
  const morningLift = Math.min(6, 1.4 + s.members * 0.035 * roomShare);

  return {
    tier,
    mrr,
    extraRev,
    cannibal,
    lateRev,
    remainingWalkIn,
    gross,
    square,
    newNet,
    todayNet,
    todayProfit,
    newProfit,
    delta: newProfit - todayProfit,
    memberHours,
    morningLift,
    roomCount: s.roomIds.length,
  };
}

export const DEFAULT_MEMBER_ROOMS = ROOMS.slice(0, 4).map((r) => r.id);
