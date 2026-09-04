import { readFile } from "node:fs/promises";
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
const terms = ["Tweet scheduler", "Twitter scheduling tool", "X scheduler", "X scheduling", "bulk tweet scheduler", "scheduled tweets", "bulk tweets", "multi-account scheduling", "tweet scheduling", "X automation", "Twitter automation"];
const missing = terms.filter((term) => !readme.toLowerCase().includes(term.toLowerCase()));
if (missing.length) { console.error(`Missing SEO terms: ${missing.join(", ")}`); process.exit(1); }
console.log(`SEO check passed: ${terms.length} phrases found.`);
