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

async function squareFromFile(src, outName, aliasName) {
  const frame = Buffer.from(
    `<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="16" width="1048" height="1048" rx="44" fill="none" stroke="rgba(180,140,40,0.4)" stroke-width="4"/>
    </svg>`
  );
  const buf = await sharp(src)
    .resize(1080, 1080, {
      fit: "contain",
      background: { r: 245, g: 239, b: 227 }
    })
    .composite([{ input: frame, top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toBuffer();
  await writeFile(path.join(outDir, outName), buf);
  if (aliasName) await writeFile(path.join(outDir, aliasName), buf);
  console.log("✓", outName);
}

async function main() {
  await mkdir(tmpDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 900 },
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

  // 1 Mercado
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 90000 });
  await wait(3500);
  await unlock(page);
  await wait(1200);
  await page.locator("#section-market").scrollIntoViewIfNeeded();
  await wait(800);
  const marketTmp = path.join(tmpDir, "market-el.png");
  await page.locator("#section-market").screenshot({ path: marketTmp });
  await squareFromFile(marketTmp, "showcase-1-home.jpg", "app-1-home-square.jpg");

  // 2 Swap / Enviar
  await page.goto(`${BASE}#swap`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await wait(2500);
  await unlock(page);
  await wait(1000);
  if (await page.locator("#qaSend").count()) {
    await page.locator("#qaSend").click();
    await wait(700);
  }
  const swapTmp = path.join(tmpDir, "swap-el.png");
  await page.locator("#swapView").screenshot({ path: swapTmp });
  await squareFromFile(swapTmp, "showcase-2-swap.jpg", "app-2-swap-square.jpg");

  // 3 Comunidad
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  await wait(2500);
  await unlock(page);
  await page.locator("#section-community").scrollIntoViewIfNeeded();
  await wait(800);
  const communityTmp = path.join(tmpDir, "community-el.png");
  await page.locator("#section-community").screenshot({ path: communityTmp });
  await squareFromFile(communityTmp, "showcase-3-community.jpg", "app-5-community-square.jpg");

  await browser.close();
  console.log("Showcase images ready");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
