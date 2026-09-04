const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export class ScheduleValidationError extends Error { constructor(message) { super(message); this.name = "ScheduleValidationError"; } }

function parseDate(value, label) {
  const date = value instanceof Date ? new Date(value) : new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) throw new ScheduleValidationError(`${label} must be a valid ISO date`);
  return date;
}

function minutes(value, label) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new ScheduleValidationError(`${label} must use HH:MM`);
  const result = Number(match[1]) * 60 + Number(match[2]);
  if (result > 1439) throw new ScheduleValidationError(`${label} must be between 00:00 and 23:59`);
  return result;
}

function seededRandom(seed = 1) {
  let state = Math.abs(Number(seed) || 1) % 2147483647;
  return () => { state = state * 16807 % 2147483647; return (state - 1) / 2147483646; };
}

function normaliseConfig(config) {
  const schedule = config.schedule ?? config;
  const start = parseDate(schedule.start_date ?? schedule.startDate, "start_date");
  const end = parseDate(schedule.end_date ?? schedule.endDate, "end_date");
  if (end < start) throw new ScheduleValidationError("end_date must not be before start_date");
  const days = (schedule.days ?? DAY_NAMES.slice(1, 6)).map((day) => typeof day === "number" ? day : DAY_NAMES.indexOf(String(day).toLowerCase()));
  if (!days.length || days.some((day) => day < 0 || day > 6)) throw new ScheduleValidationError("days must contain valid weekday names");
  const window = schedule.time_window ?? schedule.timeWindow;
  const windowStart = minutes(window?.start ?? "09:00", "time_window.start");
  const windowEnd = minutes(window?.end ?? "18:00", "time_window.end");
  if (windowEnd <= windowStart) throw new ScheduleValidationError("time_window.end must be after time_window.start");
  const blocked = (schedule.blocked_periods ?? schedule.blockedPeriods ?? []).map((period) => ({ start: minutes(period.start, "blocked_period.start"), end: minutes(period.end, "blocked_period.end") }));
  if (blocked.some((period) => period.end <= period.start)) throw new ScheduleValidationError("blocked periods must end after they start");
  const skipRatio = Number(schedule.skip_ratio ?? schedule.skipRatio ?? 0);
  if (skipRatio < 0 || skipRatio > 1) throw new ScheduleValidationError("skip_ratio must be between 0 and 1");
  const range = schedule.posts_per_day ?? schedule.postsPerDay ?? { min: 1, max: 1 };
  const minPosts = Number(range.min ?? range.minimum ?? 1); const maxPosts = Number(range.max ?? range.maximum ?? minPosts);
  if (!Number.isInteger(minPosts) || !Number.isInteger(maxPosts) || minPosts < 0 || maxPosts < minPosts) throw new ScheduleValidationError("posts_per_day range is invalid");
  const minimumInterval = Number(schedule.minimum_interval_minutes ?? schedule.minimumIntervalMinutes ?? 45);
  if (!Number.isInteger(minimumInterval) || minimumInterval < 0) throw new ScheduleValidationError("minimum_interval_minutes must be a non-negative integer");
  return { start, end, days, windowStart, windowEnd, blocked, skipRatio, minPosts, maxPosts, minimumInterval, seed: schedule.seed ?? 1, timezone: schedule.timezone ?? "UTC" };
}

function withinBlocked(slot, blocked) { return blocked.some((period) => slot >= period.start && slot < period.end); }

export function generateSchedule(tweets, config) {
  if (!Array.isArray(tweets) || tweets.length === 0) return [];
  const rules = normaliseConfig(config);
  const random = seededRandom(rules.seed);
  const candidates = [];
  for (let cursor = new Date(rules.start); cursor <= rules.end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    if (!rules.days.includes(cursor.getUTCDay())) continue;
    const count = rules.minPosts + Math.floor(random() * (rules.maxPosts - rules.minPosts + 1));
    for (let i = 0; i < count; i += 1) {
      const span = rules.windowEnd - rules.windowStart;
      const minute = rules.windowStart + Math.floor(random() * (span + 1));
      if (random() < rules.skipRatio || withinBlocked(minute, rules.blocked)) continue;
      const slot = new Date(cursor); slot.setUTCHours(0, minute, 0, 0);
      const previous = candidates.at(-1);
      if (previous && (slot - previous) / 60000 < rules.minimumInterval) continue;
      candidates.push(slot);
    }
  }
  return tweets.slice(0, candidates.length).map((tweet, index) => ({
    id: tweet.id ?? `tweet-${index + 1}`,
    text: tweet.text,
    media: tweet.media ?? [],
    group: tweet.group ?? tweet.publish_group,
    scheduledAt: candidates[index].toISOString(),
    timezone: rules.timezone,
    status: "scheduled"
  }));
}

export function assignAccounts(queue, accounts, strategy = "round-robin") {
  if (!Array.isArray(accounts) || accounts.length === 0) throw new ScheduleValidationError("at least one authorized account is required");
  return queue.map((item, index) => ({ ...item, account: strategy === "round-robin" ? accounts[index % accounts.length] : accounts[0] }));
}

export function scheduleBulk(tweets, config, accounts = []) {
  const queue = generateSchedule(tweets, config);
  return accounts.length ? assignAccounts(queue, accounts) : queue;
}

export function parseCsv(input) {
  const lines = input.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((value) => value.trim());
  return lines.slice(1).map((line) => { const values = line.split(","); return Object.fromEntries(headers.map((header, index) => [header, (values[index] ?? "").replace(/^"|"$/g, "")])); });
}
