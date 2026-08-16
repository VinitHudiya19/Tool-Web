// Copies the pdf.js worker into public/ so it is served from our own origin.
//
// Loading the worker from a CDN (the previous approach) meant every PDF tool
// broke when the CDN was blocked or offline, and added a third-party runtime
// dependency to pages that promise local-only processing.
//
// Runs on postinstall so the worker always matches the installed pdfjs-dist.

import { copyFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);

const pdfjsRoot = dirname(require.resolve("pdfjs-dist/package.json"));
const source = join(pdfjsRoot, "build", "pdf.worker.min.mjs");
const targetDir = join(process.cwd(), "public");
const target = join(targetDir, "pdf.worker.min.mjs");

await mkdir(targetDir, { recursive: true });
await copyFile(source, target);

console.log(`[pdf-worker] copied ${source} -> ${target}`);
