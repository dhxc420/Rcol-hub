import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "assets");
const tmpDir = path.join(root, ".tmp-shots");
const BASE = "https://rcol-hub.vercel.app/";
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
    .resize(1080, 1080, {
      fit: "cover",
      position: "top",
      background: { r: 245, g: 239, b: 227 }
    })
    .composite([{ input: frame, top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toBuffer();

  const meta = await sharp(buf).metadata();
  if (meta.width !== 1080 || meta.height !== 1080) {
    throw new Error(`Bad size ${meta.width}x${meta.height}`);
  }

  for (const name of outNames) {
    await writeFile(path.join(outDir, name), buf);
    console.log("✓", name, "1080x1080");
  }
}

async function main() {
  await mkdir(tmpDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    colorScheme: "light"
  });
  await page.addInitScript(() => {
    try {
      localStorage.setItem("rcol-theme", "light");
      sessionStorage.setItem("rcol-world-id-verified", "1");
    } catch {}
  });

  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 90000 });
  await wait(3500);
  await unlock(page);
  await wait(1500);

  // 1) Home — hero + staking/swap buttons + ads start
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(600);
  // Slight scroll so spotlight + start of content fill the square nicely
  await page.evaluate(() => window.scrollTo(0, 40));
  await wait(500);
  const homeTmp = path.join(tmpDir, "home-viewport.png");
  await page.screenshot({ path: homeTmp, fullPage: false });
  await toSquare1080(homeTmp, ["showcase-1-home.jpg", "app-1-home-square.jpg"]);

  // 2) Accesos — Todo RCOL en 1 toque
  await page.locator("#linksTitle").scrollIntoViewIfNeeded();
  await wait(700);
  await page.evaluate(() => {
    const section = document.querySelector(".link-section");
    if (!section) return;
    const y = section.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo(0, Math.max(0, y));
  });
  await wait(800);
  const accesosTmp = path.join(tmpDir, "accesos-viewport.png");
  await page.screenshot({ path: accesosTmp, fullPage: false });
  await toSquare1080(accesosTmp, [
    "showcase-accesos.jpg",
    "app-3-market-square.jpg"
  ]);

  // Also write a friendly alias matching the section title
  await toSquare1080(accesosTmp, ["showcase-accesos-todo-rcol.jpg"]);

  await browser.close();
  console.log("Done — both images 1080:1080");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
