import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildIcs,
  costPerVisit,
  creditsLeft,
  heatReminders,
  hsaYearTotal,
  monthGrid,
  needsRestDay,
  parseGearCsv,
  visitsByMonth,
} from "./calc.ts";

const sess = (date: string, venue = "Perspire") => ({
  id: date + venue,
  date,
  venue,
  tempF: 125,
  minutes: 15,
  coolDown: true,
});

test("visits per month and cost per visit", () => {
  const v = visitsByMonth(
    [
      sess("2026-11-01"),
      sess("2026-11-03"),
      sess("2026-10-30"),
      sess("2026-11-02", "Watercourse Way"),
    ],
    "perspire",
  );
  assert.deepEqual(v, [
    ["2026-11", 2],
    ["2026-10", 1],
  ]);
  assert.equal(costPerVisit(100, 4), 25);
  assert.equal(costPerVisit(100, 0), null);
});

test("credits never go negative", () => {
  assert.equal(creditsLeft(4, [{ id: "a", date: "2026-11-01" }]), 3);
  assert.equal(
    creditsLeft(1, [
      { id: "a", date: "x" },
      { id: "b", date: "y" },
    ]),
    0,
  );
});

test("hsa year total", () => {
  assert.equal(
    hsaYearTotal(
      [
        { id: "1", date: "2026-01-02", amount: 40, category: "x" },
        { id: "2", date: "2025-12-31", amount: 99, category: "x" },
      ],
      2026,
    ),
    40,
  );
});

test("heat reminders and rest day", () => {
  assert.equal(heatReminders({ tempF: 125, minutes: 15, coolDown: true }).length, 0);
  assert.equal(heatReminders({ tempF: 125, minutes: 25, coolDown: false }).length, 2);
  assert.equal(needsRestDay([sess("2026-11-03"), sess("2026-11-04")]), true);
  assert.equal(needsRestDay([sess("2026-11-01"), sess("2026-11-04")]), false);
});

test("gear csv paste", () => {
  const rows = parseGearCsv(
    'Order Date,Title,Item Total\n2026-03-02,"Back pad, infrared",$89.99\n',
  );
  assert.equal(rows.length, 1);
  assert.equal(rows[0].name, "Back pad, infrared");
  assert.equal(rows[0].price, 89.99);
  assert.deepEqual(parseGearCsv("nope"), []);
});

test("ics export and month grid", () => {
  const ics = buildIcs([
    {
      id: "p1",
      date: "2026-11-05",
      time: "09:30",
      title: "Soak, then contrast",
      venue: "Watercourse Way",
    },
  ]);
  assert.match(ics, /DTSTART:20261105T093000\r\n/);
  assert.match(ics, /SUMMARY:Soak\\, then contrast/);
  assert.equal(monthGrid(2026, 10).length % 7, 0);
});
