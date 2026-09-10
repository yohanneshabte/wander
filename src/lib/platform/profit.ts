import { formatMoney } from "@/lib/utils";
import type { HouseCatalog, ProfitInputs } from "./types";

const DAYS = 30;
const NO_SHOW_RECOVER = 0.65;
const DEAD_SLOT_LIFT = 0.12;
const MEMBER_ATTACH = 0.18;

export function defaultProfit(house: HouseCatalog): ProfitInputs {
  const avg =
    house.services
      .map((s) => s.listPrice ?? s.weekdayPrice ?? 0)
      .filter((n) => n > 40 && n < 400)
      .reduce((a, b, _, arr) => a + b / arr.length, 0) || 130;
  const dues =
    house.memberships.reduce((a, m) => a + m.priceMonth, 0) /
      Math.max(1, house.memberships.length) || 0;
  if (house.site.id === "solivana") {
    return {
      sessionsPerDay: 14,
      avgTicket: Math.round(avg),
      occupancy: 55,
      costs: 38,
      members: 40,
      avgDues: Math.round(dues) || 239,
      noShowPct: 8,
    };
  }
  return {
    sessionsPerDay: 20,
    avgTicket: Math.round(avg) || 150,
    occupancy: 60,
    costs: 40,
    members: 25,
    avgDues: Math.round(dues) || 159,
    noShowPct: 12,
  };
}

export function assessProfit(house: HouseCatalog, i: ProfitInputs) {
  const walkIn = i.sessionsPerDay * i.avgTicket * DAYS * (i.occupancy / 100);
  const dues = i.members * i.avgDues;
  const gross = walkIn + dues;
  const noShowLoss = walkIn * (i.noShowPct / 100);
  const recovered = noShowLoss * NO_SHOW_RECOVER;
  const deadSlots = walkIn * DEAD_SLOT_LIFT;
  const extraMembers = i.sessionsPerDay * DAYS * MEMBER_ATTACH * 0.15 * i.avgDues;
  const lift = recovered + deadSlots + extraMembers;
  const after = gross + lift;
  const costNow = gross * (i.costs / 100);
  const costAfter = after * (i.costs / 100);
  const profit = gross - costNow;
  const profitAfter = after - costAfter;
  const rooms = house.resources.length;
  const hours = Math.max(1, (house.site.closeMin - house.site.openMin) / 60);
  const capacity = rooms * hours * DAYS;
  const used = i.sessionsPerDay * DAYS;
  return {
    gross,
    dues,
    walkIn,
    profit,
    after,
    profitAfter,
    lift,
    liftPct: gross ? lift / gross : 0,
    used,
    capacity,
    util: capacity ? used / capacity : 0,
    sentence: sentence(house, lift, profitAfter - profit),
  };
}

function sentence(house: HouseCatalog, lift: number, extraProfit: number) {
  if (house.site.id === "solivana") {
    return `Filling weekday 11–2 slots with 45-min Mini Float and Core packs, plus cutting no-shows with a card on file, could add about ${formatMoney(lift)} / month (~${formatMoney(extraProfit)} profit) without new rooms.`;
  }
  return `Filling dead weekday mornings with 2-hour off-peak soaks and cutting phone-tag no-shows could add about ${formatMoney(lift)} / month (~${formatMoney(extraProfit)} profit) on the same nine rooms.`;
}
