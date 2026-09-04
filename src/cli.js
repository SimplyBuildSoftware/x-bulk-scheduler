#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { parseCsv, scheduleBulk } from "./scheduler.js";

function help() { console.log(`x-bulk-scheduler\n\nUsage:\n  x-bulk-scheduler schedule --tweets examples/tweets.json --config examples/scheduler-config.json\n  x-bulk-scheduler csv --tweets examples/tweets.csv --config examples/scheduler-config.json\n\nThe CLI prints a JSON publishing queue. It never publishes to X by itself.`); }
function arg(name) { const index = process.argv.indexOf(name); return index >= 0 ? process.argv[index + 1] : undefined; }
if (process.argv.includes("--help") || !process.argv[2]) help();
else {
  const tweetsFile = arg("--tweets"); const configFile = arg("--config");
  if (!tweetsFile || !configFile) { help(); process.exitCode = 1; }
  else {
    const raw = await readFile(tweetsFile, "utf8");
    const tweets = process.argv[2] === "csv" ? parseCsv(raw) : JSON.parse(raw);
    const config = JSON.parse(await readFile(configFile, "utf8"));
    console.log(JSON.stringify(scheduleBulk(tweets, config, (arg("--accounts") ?? "").split(",").filter(Boolean)), null, 2));
  }
}
