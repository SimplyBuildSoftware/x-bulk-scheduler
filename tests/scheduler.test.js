import test from "node:test";
import assert from "node:assert/strict";
import { assignAccounts, generateSchedule, parseCsv, ScheduleValidationError } from "../src/scheduler.js";

const tweets = Array.from({ length: 8 }, (_, index) => ({ id: `t${index}`, text: `Tweet ${index}` }));
const base = { start_date: "2026-09-07", end_date: "2026-09-11", days: ["monday", "wednesday", "friday"], time_window: { start: "09:00", end: "18:00" }, posts_per_day: { min: 1, max: 1 }, minimum_interval_minutes: 45, seed: 7 };

test("filters by date range and days of week", () => { const queue = generateSchedule(tweets, base); assert.ok(queue.length > 0); assert.ok(queue.every((item) => [1, 3, 5].includes(new Date(item.scheduledAt).getUTCDay()))); });
test("respects blocked periods", () => { const queue = generateSchedule(tweets, { ...base, blocked_periods: [{ start: "00:00", end: "23:59" }] }); assert.equal(queue.length, 0); });
test("validates skip ratio and date order", () => { assert.throws(() => generateSchedule(tweets, { ...base, skip_ratio: 2 }), ScheduleValidationError); assert.throws(() => generateSchedule(tweets, { ...base, start_date: "2026-09-12" }), ScheduleValidationError); });
test("is deterministic with a seed", () => { assert.deepEqual(generateSchedule(tweets, base), generateSchedule(tweets, base)); });
test("enforces minimum interval", () => { const queue = generateSchedule(tweets, { ...base, posts_per_day: { min: 4, max: 4 }, minimum_interval_minutes: 120 }); const times = queue.map((item) => new Date(item.scheduledAt).getTime()); assert.ok(times.every((time, index) => index === 0 || time - times[index - 1] >= 120 * 60000)); });
test("assigns accounts round-robin", () => { const queue = assignAccounts([{ id: "1" }, { id: "2" }, { id: "3" }], ["a", "b"]); assert.deepEqual(queue.map((item) => item.account), ["a", "b", "a"]); });
test("parses simple CSV input", () => { assert.deepEqual(parseCsv('text,media,publish_group\n"Hello X",,campaign-a'), [{ text: "Hello X", media: "", publish_group: "campaign-a" }]); });
