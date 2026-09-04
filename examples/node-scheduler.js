import { readFile } from "node:fs/promises";
import { scheduleBulk } from "../src/index.js";

const tweets = JSON.parse(await readFile(new URL("./tweets.json", import.meta.url), "utf8"));
const config = JSON.parse(await readFile(new URL("./scheduler-config.json", import.meta.url), "utf8"));
console.log(scheduleBulk(tweets, config, ["account-a", "account-b"]));
