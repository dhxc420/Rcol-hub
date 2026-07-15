import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, writeFile, copyFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "assets");
const tmpDir = path.join(root, ".tmp-shots");
const BASE = process.env.SHOWCASE_BASE || "http://127.0.0.1:4173/";
const SOURCE = process.env.SHOWCASE_SOURCE || "";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function unlock(page) {
  await page.evaluate(() => {
    document.querySelector("#worldIdModal")?.setAttribute("hidden", "");
    document.body.classList.remove("is-humanity-locked", "is-worldid-native");
  });
}

async function toSquare1080(src, outNames) {
  const frame = Buffer.from(
    `<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="16" width="1048" height="1048" rx="44" fill="none" stroke="rgba(180,140,40,0.4)" stroke-width="4"/>
    </svg>`
  );
  const buf = await sharp(src)
    .rotate()
    .resize(1080, 1080, {
      fit: "cover",
      position: "top",
      background: { r: 12, g: 10, b: 8 }
    })
    .composite([{ input: frame, top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toBuffer();

  const meta = await sharp(buf).metadata();
  if (meta.width !== 1080 || meta.height !== 1080) {
    throw new Error(`Bad size ${meta.width}x${meta.height}`);
  }

  for (const name of outNames) {
    const dest = path.join(outDir, name);
    await writeFile(dest, buf);
    console.log("✓", name, `${meta.width}x${meta.height}`);
  }
}

async function captureHome() {
  await mkdir(tmpDir, { recursive: true });
  const homeTmp = path.join(tmpDir, "home-viewport.png");

  if (SOURCE) {
    await copyFile(SOURCE, homeTmp);
    return homeTmp;
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    colorScheme: "dark"
  });
  await page.addInitScript(() => {
    try {
      localStorage.setItem("rcol-theme", "dark");
      sessionStorage.setItem("rcol-world-id-verified", "1");
    } catch {}
  });

  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 90000 });
  await wait(3500);
  await unlock(page);
  await wait(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(500);
  await page.screenshot({ path: homeTmp, fullPage: false });
  await browser.close();
  return homeTmp;
}

async function main() {
  const src = await captureHome();
  await toSquare1080(src, [
    "showcase-1-home.jpg",
    "app-1-home-square.jpg",
    "app-1-home.jpg"
  ]);
  console.log("Home showcase ready — all 1080x1080");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
