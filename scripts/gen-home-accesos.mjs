import { chromium } from "playwright";
import sharp from "sharp";
import { writeFile } from "fs/promises";

const BASE = "https://rcol-hub.vercel.app/";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const frame = Buffer.from(
  `<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="16" width="1048" height="1048" rx="44" fill="none" stroke="rgba(180,140,40,0.4)" stroke-width="4"/></svg>`
);

async function saveSquare(src, names, fit = "contain") {
  const buf = await sharp(src)
    .resize(1080, 1080, {
      fit,
      position: "top",
      background: { r: 245, g: 239, b: 227 }
    })
    .composite([{ input: frame, top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toBuffer();
  const m = await sharp(buf).metadata();
  if (m.width !== 1080 || m.height !== 1080) throw new Error(`bad ${m.width}x${m.height}`);
  for (const name of names) {
    await writeFile(`assets/${name}`, buf);
    console.log("✓", name, "1080x1080");
  }
}

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
await page.evaluate(() => {
  document.querySelector("#worldIdModal")?.setAttribute("hidden", "");
  document.body.classList.remove("is-humanity-locked");
});
await wait(1000);

// Home viewport
await page.evaluate(() => window.scrollTo(0, 0));
await wait(500);
await page.screenshot({ path: ".tmp-shots/home-v.png", fullPage: false });
await saveSquare(".tmp-shots/home-v.png", ["showcase-1-home.jpg", "app-1-home-square.jpg"], "cover");

// Accesos section element
await page.locator(".link-section").scrollIntoViewIfNeeded();
await wait(800);
await page.locator(".link-section").screenshot({ path: ".tmp-shots/accesos-el.png" });
await saveSquare(
  ".tmp-shots/accesos-el.png",
  [
    "showcase-accesos.jpg",
    "showcase-accesos-todo-rcol.jpg",
    "Accesos Todo RCOL en 1 toque.jpg",
    "app-3-market-square.jpg"
  ],
  "contain"
);

await browser.close();
console.log("Done");
