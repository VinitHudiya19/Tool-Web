const fs = require("fs");
const path = require("path");

/**
 * Rewrites every hardcoded non-www URL to the canonical www form.
 *
 * The site 301s quicktoolz.tech to www.quicktoolz.tech, so a canonical tag
 * pointing at the bare host names a URL that immediately redirects. Google
 * treats that as a conflicting signal.
 */
const OLD = "https://quicktoolz.tech";
const NEW = "https://www.quicktoolz.tech";

const roots = ["src", "public"];
const exts = new Set([".ts", ".tsx", ".txt", ".json", ".md"]);

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(p);
    return exts.has(path.extname(entry.name)) ? [p] : [];
  });

// These two now derive the host from SITE_URL, so leave them alone.
const skip = new Set([
  path.normalize("src/lib/seo/schema.ts"),
  path.normalize("src/lib/site.config.ts"),
]);

let files = 0;
let hits = 0;

for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    if (skip.has(path.normalize(file))) continue;
    const source = fs.readFileSync(file, "utf8");
    if (!source.includes(OLD)) continue;

    // Only the bare host — never touch an existing www URL.
    const count = source.split(OLD).length - 1;
    const updated = source.split(OLD).join(NEW);
    fs.writeFileSync(file, updated);
    files += 1;
    hits += count;
    console.log(`  ${String(count).padStart(3)}  ${file.split(path.sep).join("/")}`);
  }
}

console.log(`\nrewrote ${hits} occurrences across ${files} files`);

// Confirm nothing bare is left anywhere.
let leftovers = 0;
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    const source = fs.readFileSync(file, "utf8");
    // A bare host not preceded by "www."
    const bare = source.match(/https:\/\/quicktoolz\.tech/g);
    if (bare) {
      leftovers += bare.length;
      console.log("LEFTOVER", file, bare.length);
    }
  }
}
console.log(leftovers === 0 ? "no bare-host URLs remain" : `${leftovers} bare URLs remain`);
