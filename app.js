const CONFIG_URL = "./config.json";
const WORLD_ID_STORAGE_KEY = "rcol-world-id-verified";
const WORLD_ID_NULLIFIER_KEY = "rcol-world-id-nullifier";
const ADDRESS_BOOK = "0x57b930D551e677CC36e2fA036Ae2fe8FdaE0330D";
const ADDRESS_BOOK_SELECTOR = "0x47e7ef24"; // addressVerifiedUntil(address)

const RCOL_ADDRESS = "0x82bF7aA0680D9C2D6fFa77b995e2092fE68d308a";
const RCOL_DECIMALS = 18;
const WORLDCHAIN_RPC = "https://worldchain-mainnet.g.alchemy.com/public";
const EXPLORER_TOKEN_API = "https://worldchain-mainnet.explorer.alchemy.com/api/v2/tokens/";
const DEXSCREENER_TOKENS_API = "https://api.dexscreener.com/tokens/v1/worldchain/";
const STAKING_APP_URL =
  "https://world.org/mini-app?app_id=app_71ab236862b2a6b92bb663a6ceeda3f2&path=&draft_id=meta_8e90416ea4ab360f84c860bb90fac074";
const BURN_ADDRESSES = [
  "0x000000000000000000000000000000000000dEaD",
  "0x0000000000000000000000000000000000000000"
];

const WLD_ADDRESS = "0x2cFc85d8E48F8EAB294be644d9E25C3030863003";
const RCOL_POOL = "0xe5f1c6b95cf182b09807b73f21f622fae08dd439"; // pool Uniswap v2 RCOL/WLD
const GECKO_OHLCV_API = `https://api.geckoterminal.com/api/v2/networks/world-chain/pools/${RCOL_POOL}/ohlcv/hour?aggregate=1&limit=24`;

const SWAP_TOKENS = [
  { symbol: "RCOL", name: "RCOL", address: RCOL_ADDRESS, decimals: 18, logo: "./assets/rcol-coin.png" },
  { symbol: "WLD", name: "Worldcoin", address: WLD_ADDRESS, decimals: 18, logo: "./assets/token-wld.png" },
  { symbol: "USDC", name: "USD Coin", address: "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1", decimals: 6, logo: "./assets/token-usdc.png" },
  { symbol: "WETH", name: "Ethereum", address: "0x4200000000000000000000000000000000000006", decimals: 18, logo: "./assets/token-weth.png" }
];

// RCOL solo tiene liquidez contra WLD (pool Uniswap v2 en Worldchain).
// Cualquier otro token se enruta a traves de WLD.
const UNISWAP_V2_ROUTER = "0x541aB7c31A119441eF3575F6973277DE0eF460bd"; // solo para cotizar (getAmountsOut)
// El swap se ejecuta via Permit2 + Universal Router: World App no permite el
// approve de ERC20 directo (error disallowed_operation), pero si Permit2.
const UNIVERSAL_ROUTER = "0x8ac7bee993bb44dab564ea4bc9ea67bf9eb5e743";
const PERMIT2 = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
const V2_SWAP_EXACT_IN = "0x08"; // comando del Universal Router
const PERMIT2_TRANSFER_FROM = "0x02"; // jala ERC20 via Permit2 hacia un destinatario
const UR_MSG_SENDER = "0x0000000000000000000000000000000000000001"; // constante: el destinatario es quien firma
// RCOL cobra ~2% de impuesto en cada transferencia (token fee-on-transfer),
// que getAmountsOut no refleja. El slippage debe cubrir ese impuesto + movimiento.
const SWAP_SLIPPAGE_BPS = 400n; // 4.0%
const SWAP_DEADLINE_MIN = 20;

const fallbackConfig = {
  brand: "RCOL Hub",
  headline: "Bienvenido al Hub de RCOLombia DAO",
  tagline: "Comunidad verificada con World ID. Nuestra identidad, nuestro respaldo.",
  tokenAddress: RCOL_ADDRESS,
  worldIdAppId: "app_a95edab5dd0638c6f02dcf3ff407694c",
  worldIdRpId: "rp_013fbbe37584c9e5",
  worldIdAction: "rcol-hub-access",
  links: [
    {
      id: "website",
      title: "Sitio web RCOL",
      description: "rcol.fun",
      url: "https://dhxc420.github.io/Rcol.fun/",
      icon: "globe-2",
      accent: "#f8d66d"
    },
    {
      id: "social",
      title: "Redes Sociales",
      description: "X y Telegram",
      url: "#section-community",
      icon: "messages-square",
      accent: "#ffffff"
    },
    {
      id: "games",
      title: "Juegos RCOL",
      description: "Vuela RCOL y mas",
      icon: "gamepad-2",
      accent: "#a855f7",
      games: [
        {
          title: "Vuela RCOL",
          description: "En World App",
          url: "https://world.org/mini-app?app_id=app_a5901e6e8ce50db069d46bfb3c9b0fa3",
          icon: "./assets/vuela-rcol.png",
          isImage: true,
          status: "reviewing"
        },
        {
          title: "Flappy Butterfly",
          description: "En World App",
          url: "https://world.org/mini-app?app_id=app_49dc4d4a33e979e43f1dd2f4bbd7ba32",
          icon: "bird",
          status: "reviewing"
        },
        {
          title: "World Runner Arcade Game",
          description: "En World App",
          url: "https://world.org/mini-app?app_id=app_bb51c58c8fd37c9439bff25d16b1bbc5",
          icon: "footprints",
          status: "reviewing"
        }
      ]
    },
    {
      id: "puf",
      title: "Staking RCOL",
      description: "Haz staking de RCOL",
      url: STAKING_APP_URL,
      icon: "landmark",
      accent: "#facc15"
    },
    {
      id: "chart",
      title: "Chart RCOL",
      description: "Precio y pares",
      icon: "line-chart",
      accent: "#38bdf8",
      actions: [
        {
          label: "DexScreener",
          url: "https://dexscreener.com/worldchain/0x82bF7aA0680D9C2D6fFa77b995e2092fE68d308a"
        },
        {
          label: "GeckoTerminal",
          url: "https://www.geckoterminal.com/es/world-chain/pools/0xe5f1c6b95cf182b09807b73f21f622fae08dd439"
        }
      ]
    }
  ],
  community: [
    {
      title: "X",
      handle: "@Rcol_Oficial",
      url: "https://x.com/Rcol_Oficial",
      icon: "./assets/x-icon.svg"
    },
    {
      title: "Telegram",
      handle: "t.me/oficialRcol",
      url: "https://t.me/oficialRcol",
      icon: "send"
    }
  ],
  announcements: [
    {
      title: "Vuela RCOL",
      subtitle: "Juega ahora en World App",
      icon: "./assets/vuela-rcol-icon.png",
      accent: "#facc15",
      image: "",
      url: "https://world.org/mini-app?app_id=app_a5901e6e8ce50db069d46bfb3c9b0fa3"
    },
    {
      title: "World Runner Arcade Game",
      subtitle: "Juega ahora en World App",
      icon: "footprints",
      accent: "#a855f7",
      image: "",
      url: "https://world.org/mini-app?app_id=app_bb51c58c8fd37c9439bff25d16b1bbc5"
    },
    {
      title: "Flappy Butterfly",
      subtitle: "Juega ahora en World App",
      icon: "bird",
      accent: "#18e0a0",
      image: "",
      url: "https://world.org/mini-app?app_id=app_49dc4d4a33e979e43f1dd2f4bbd7ba32"
    },
    {
      title: "Siguenos en X",
      subtitle: "@Rcol_Oficial",
      icon: "./assets/x-icon.svg",
      accent: "#ffffff",
      image: "",
      url: "https://x.com/Rcol_Oficial"
    }
  ],
  nft: {
    title: "RCOL Protocol Genesis",
    tagline: "NFT de utilidad",
    description:
      "Coleccion de 100 NFT unicos. Cada Genesis es tu llave de holder verificado: desbloquea ventajas en los juegos RCOL, badge en el hub y airdrops exclusivos. Mientras mas baja la edicion, mayores los beneficios.",
    image: "./assets/nft-genesis.png",
    supply: 100,
    minted: 0,
    status: "coming_soon",
    ctaLabel: "Unirme a la lista",
    ctaUrl: "https://t.me/updatesDzc",
    contract: "",
    benefits: [
      {
        icon: "gamepad-2",
        title: "Boost en los juegos",
        description: "Multiplicador de puntos y vidas extra en Vuela RCOL y los proximos juegos."
      },
      {
        icon: "badge-check",
        title: "Holder verificado",
        description: "Badge en el hub que identifica tu wallet como holder Genesis."
      },
      {
        icon: "gift",
        title: "Airdrops y recompensas",
        description: "Reparto de RCOL, sorteos y recompensas periodicas solo para holders."
      }
    ],
    rarity: [
      { tier: "Legendaria", range: "#001 - #010", perk: "Boost x3 + airdrops dobles" },
      { tier: "Epica", range: "#011 - #040", perk: "Boost x2 + sorteos" },
      { tier: "Genesis", range: "#041 - #100", perk: "Boost x1.5 + badge" }
    ],
    items: [
      { edition: "001", name: "Genesis #001", tier: "Legendaria", perk: "Boost x3", image: "" },
      { edition: "002", name: "Genesis #002", tier: "Legendaria", perk: "Boost x3", image: "./assets/nft-genesis.png" },
      { edition: "003", name: "Genesis #003", tier: "Legendaria", perk: "Boost x3", image: "" },
      { edition: "012", name: "Genesis #012", tier: "Epica", perk: "Boost x2", image: "" },
      { edition: "021", name: "Genesis #021", tier: "Epica", perk: "Boost x2", image: "" },
      { edition: "034", name: "Genesis #034", tier: "Epica", perk: "Boost x2", image: "" },
      { edition: "047", name: "Genesis #047", tier: "Genesis", perk: "Boost x1.5", image: "" },
      { edition: "063", name: "Genesis #063", tier: "Genesis", perk: "Boost x1.5", image: "" },
      { edition: "088", name: "Genesis #088", tier: "Genesis", perk: "Boost x1.5", image: "" },
      { edition: "100", name: "Genesis #100", tier: "Genesis", perk: "Boost x1.5", image: "" }
    ]
  }
};

// Paleta por rareza para el arte generado.
const NFT_TIER_COLORS = {
  Legendaria: { base: "#f8d66d", light: "#fff4cf" },
  Epica: { base: "#b06bff", light: "#e7d2ff" },
  Genesis: { base: "#18e0a0", light: "#bcffe9" }
};

// Arte de mariposa-cristal generado por SVG (placeholder hasta que haya imagen real).
function generateNftArt(seed, tier) {
  const color = NFT_TIER_COLORS[tier] || NFT_TIER_COLORS.Genesis;
  const g = `n${seed}`;
  // PRNG simple para variar destellos por edicion.
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const sparkles = Array.from({ length: 4 }, () => {
    const x = (8 + rnd() * 48).toFixed(1);
    const y = (8 + rnd() * 48).toFixed(1);
    const r = (0.6 + rnd() * 1.1).toFixed(1);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${(0.4 + rnd() * 0.5).toFixed(2)}"/>`;
  }).join("");

  const wingUpper = "M32 30 C40 11 56 12 59 24 C60 33 47 35 32 33 Z";
  const wingLower = "M32 35 C45 36 55 45 50 55 C45 61 35 57 32 44 Z";
  const facets = `<path d="M32 31 L57 21 M32 33 L52 31 M32 38 L49 51 M32 40 L44 44" stroke="rgba(255,255,255,0.4)" stroke-width="0.4" fill="none"/>`;

  return `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="bg${g}" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stop-color="${color.base}" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#0a0805"/>
        </radialGradient>
        <linearGradient id="w${g}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color.light}"/>
          <stop offset="100%" stop-color="${color.base}"/>
        </linearGradient>
      </defs>
      <rect width="64" height="64" fill="url(#bg${g})"/>
      ${sparkles}
      <g filter="drop-shadow(0 0 3px ${color.base})">
        <g fill="url(#w${g})" stroke="rgba(255,255,255,0.5)" stroke-width="0.5">
          <path d="${wingUpper}"/>
          <path d="${wingLower}"/>
        </g>
        <g fill="url(#w${g})" stroke="rgba(255,255,255,0.5)" stroke-width="0.5" transform="translate(64,0) scale(-1,1)">
          <path d="${wingUpper}"/>
          <path d="${wingLower}"/>
        </g>
        ${facets}
        <g transform="translate(64,0) scale(-1,1)">${facets}</g>
        <ellipse cx="32" cy="35" rx="1.5" ry="9" fill="#0d0a06" stroke="${color.base}" stroke-width="0.4"/>
        <path d="M32 26 q-4 -5 -7 -7 M32 26 q4 -5 7 -7" stroke="${color.base}" stroke-width="0.6" fill="none"/>
      </g>
    </svg>`;
}

let nftConfig = null;
let nftFilter = "Todas";
let currentNftItem = null;

// Arte de un item: imagen real si la hay, si no la mariposa generada (seed por edicion = estable).
function nftItemArt(item) {
  if (item.image) return `<img src="${escapeHtml(item.image)}" alt="" loading="lazy" />`;
  return generateNftArt(parseInt(item.edition, 10) || 1, item.tier);
}

function renderNftFilters() {
  const wrap = document.querySelector("#nftFilters");
  if (!wrap) return;
  const tiers = [...new Set((nftConfig?.items || []).map((item) => item.tier))];
  const filters = ["Todas", ...tiers];
  if (!filters.includes(nftFilter)) nftFilter = "Todas";

  wrap.innerHTML = filters
    .map(
      (filter) =>
        `<button class="nft-filter${filter === nftFilter ? " is-active" : ""}" type="button" data-filter="${escapeHtml(filter)}">${escapeHtml(filter)}</button>`
    )
    .join("");

  wrap.querySelectorAll(".nft-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      nftFilter = btn.dataset.filter;
      wrap.querySelectorAll(".nft-filter").forEach((b) => b.classList.toggle("is-active", b === btn));
      renderNftGallery();
    });
  });
}

function renderNftGallery() {
  const grid = document.querySelector("#nftGallery");
  if (!grid) return;
  const all = nftConfig?.items || [];
  const list = nftFilter === "Todas" ? all : all.filter((item) => item.tier === nftFilter);

  grid.innerHTML = list
    .map((item) => {
      const tierColor = NFT_TIER_COLORS[item.tier] || NFT_TIER_COLORS.Genesis;
      return `
        <button class="nft-item" type="button" style="--tc:${tierColor.base}">
          <span class="nft-item__art">${nftItemArt(item)}</span>
          <span class="nft-item__meta">
            <span class="nft-item__row">
              <span class="nft-item__edition">#${escapeHtml(item.edition)}</span>
              <span class="nft-item__tier">${escapeHtml(item.tier)}</span>
            </span>
            <span class="nft-item__perk">${escapeHtml(item.perk)}</span>
          </span>
        </button>`;
    })
    .join("");

  grid.querySelectorAll(".nft-item").forEach((el, i) => {
    el.addEventListener("click", () => openNftModal(list[i]));
  });
  window.lucide?.createIcons?.();
}

function openNftModal(item) {
  const modal = document.querySelector("#nftModal");
  if (!modal || !item) return;
  currentNftItem = item;
  const tierColor = NFT_TIER_COLORS[item.tier] || NFT_TIER_COLORS.Genesis;

  modal.style.setProperty("--tc", tierColor.base);
  modal.querySelector("#nftModalArt").innerHTML = nftItemArt(item);
  modal.querySelector("#nftModalName").textContent = item.name || `Genesis #${item.edition}`;
  const tierEl = modal.querySelector("#nftModalTier");
  tierEl.textContent = item.tier;
  modal.querySelector("#nftModalEdition").textContent = `Edicion ${item.edition} de ${nftConfig?.supply || 100}`;
  modal.querySelector("#nftModalPerk").innerHTML = `<i data-lucide="zap" aria-hidden="true"></i> ${escapeHtml(item.perk)}`;
  modal.querySelector("#nftModalBenefits").innerHTML = (nftConfig?.benefits || [])
    .map(
      (benefit) =>
        `<li><i data-lucide="${escapeHtml(benefit.icon || "star")}" aria-hidden="true"></i><span>${escapeHtml(benefit.title)}</span></li>`
    )
    .join("");
  modal.querySelector("#nftModalNote").textContent =
    nftConfig?.status === "live" ? "Disponible para mintear" : "Proximamente disponible";

  modal.hidden = false;
  document.body.classList.add("modal-open");
  window.lucide?.createIcons?.();
}

function closeNftModal() {
  const modal = document.querySelector("#nftModal");
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
}

function setupNftModal() {
  const modal = document.querySelector("#nftModal");
  if (!modal) return;
  modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeNftModal));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeNftModal();
  });
  document.querySelector("#nftModalShare")?.addEventListener("click", () => shareNft(currentNftItem));
}

// Genera un archivo de imagen del NFT (imagen real o el SVG rasterizado).
async function nftImageFile(item, name) {
  const artEl = document.querySelector("#nftModalArt");
  if (!artEl) return null;
  const imgEl = artEl.querySelector("img");
  if (imgEl) {
    const response = await fetch(imgEl.src);
    const blob = await response.blob();
    return new File([blob], `${name}.png`, { type: blob.type || "image/png" });
  }
  const svg = artEl.querySelector("svg");
  if (!svg) return null;
  const xml = new XMLSerializer().serializeToString(svg);
  const dataUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
  const image = new Image();
  image.src = dataUri;
  await image.decode();
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvas.getContext("2d").drawImage(image, 0, 0, size, size);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  return blob ? new File([blob], `${name}.png`, { type: "image/png" }) : null;
}

async function shareNft(item) {
  if (!item) return;
  const url = `${location.origin}${location.pathname}#nft`;
  const title = `RCOL Genesis #${item.edition}`;
  const text = `Mira el NFT ${title} (${item.tier}) - ${item.perk} en los juegos RCOL. ${url}`;

  // 1) Intentar compartir la imagen del NFT (si el dispositivo lo soporta).
  try {
    const file = await nftImageFile(item, title);
    if (file && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title, text: `${title} (${item.tier}) - ${item.perk}` });
      return;
    }
  } catch (error) {
    if (error?.name === "AbortError") return; // el usuario cancelo
  }

  // 2) Compartir link (MiniKit / nativo / portapapeles).
  try {
    if (MiniKitApi?.share) {
      await MiniKitApi.share({ title, text, url });
      return;
    }
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return;
    }
    await navigator.clipboard.writeText(text);
    showToast("Link del NFT copiado");
  } catch (error) {
    if (error?.name !== "AbortError") showToast("No se pudo compartir ahora");
  }
}

let MiniKitApi = null;
let activeConfig = null;
let worldAppReady = false;
const tokenPrices = {};

async function loadMiniKit(appId) {
  try {
    const looksLikeWorldApp = Boolean(window.WorldApp) || /WorldApp|MiniKit/i.test(navigator.userAgent);
    if (!looksLikeWorldApp) return { success: false };

    const mod = await import("https://cdn.jsdelivr.net/npm/@worldcoin/minikit-js@2.0.3/+esm");
    MiniKitApi = mod.MiniKit;
    const installResult = await MiniKitApi?.install?.(appId || undefined);
    if (MiniKitApi && typeof window !== "undefined") {
      window.MiniKit = MiniKitApi;
    }
    return installResult;
  } catch (error) {
    console.error("MiniKit install error:", error);
    return { success: false };
  }
}

async function ensureMiniKitReady(appId) {
  if (!MiniKitApi) {
    await loadMiniKit(appId);
  } else if (appId) {
    await MiniKitApi.install(appId);
  } else if (!MiniKitApi.isInstalled?.()) {
    await MiniKitApi.install(undefined);
  }
  return Boolean(window.WorldApp) || Boolean(MiniKitApi?.isInstalled?.());
}

function setWorldIdModalHint(message) {
  const hint = document.querySelector(".worldid-modal__hint");
  if (hint) hint.textContent = message;
}

function worldIdErrorMessage(error) {
  const code = String(error?.message || error || "").trim();
  const map = {
    generic_error: "World App no pudo abrir World ID. Actualiza World App e intenta de nuevo.",
    cancelled: "Verificacion cancelada",
    user_rejected: "Verificacion cancelada",
    timeout: "Tiempo agotado. Intenta de nuevo.",
    verification_failed: "Verificacion rechazada por World",
    sign_failed: "No se pudo firmar la solicitud World ID",
    app_out_of_date: "Actualiza World App para verificar humanidad"
  };
  return map[code] || (code ? `World ID: ${code}` : "No se pudo verificar. Intenta de nuevo.");
}

async function loadConfig() {
  try {
    const response = await fetch(CONFIG_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("No config");
    return await response.json();
  } catch {
    return fallbackConfig;
  }
}

function showToast(message, duration = 2200) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), duration);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char])
  );
}

function isPlaceholder(url) {
  return !url || url.startsWith("#pendiente");
}

function isInternalAnchor(url) {
  return url?.startsWith("#") && !isPlaceholder(url);
}

function renderIcon(link) {
  if (link.isImage) {
    return `<img src="${escapeHtml(link.icon)}" alt="" loading="lazy" />`;
  }

  return `<i data-lucide="${escapeHtml(link.icon || "external-link")}" aria-hidden="true"></i>`;
}

const GAME_STATUS = {
  verified: { label: "Verificado", icon: "badge-check", cls: "is-verified" },
  reviewing: { label: "Verificando", icon: "clock", cls: "is-reviewing" },
  unverified: { label: "Sin verificar", icon: "alert-triangle", cls: "is-unverified" }
};

// Tarjeta desplegable "Juegos RCOL" con tag de verificacion por juego.
function buildGamesCard(link) {
  const card = document.createElement("div");
  card.className = "link-card link-card--games";
  card.style.setProperty("--accent", link.accent || "#a855f7");

  const items = link.games
    .map((game) => {
      const status = GAME_STATUS[game.status] || GAME_STATUS.unverified;
      const tag = `<span class="game-tag ${status.cls}"><i data-lucide="${status.icon}" aria-hidden="true"></i>${status.label}</span>`;
      const body = `
        <span class="game-item__icon">${renderIcon(game)}</span>
        <span class="game-item__body">
          <strong>${escapeHtml(game.title)}</strong>
          <small>${escapeHtml(game.description || "")}</small>
        </span>
        ${tag}`;
      if (isPlaceholder(game.url)) {
        return `<button class="game-item is-soon" type="button" data-soon="1">${body}</button>`;
      }
      return `<a class="game-item" href="${encodeURI(game.url)}" target="_blank" rel="noreferrer">${body}</a>`;
    })
    .join("");

  card.innerHTML = `
    <button class="link-card__toggle" type="button" aria-expanded="false">
      <span class="link-card__icon">${renderIcon(link)}</span>
      <span class="link-card__body">
        <h3>${escapeHtml(link.title)}</h3>
        <p>${escapeHtml(link.description || "")}</p>
      </span>
      <i data-lucide="chevron-down" class="link-card__caret" aria-hidden="true"></i>
    </button>
    <div class="games-list" hidden>${items}</div>
  `;

  const toggle = card.querySelector(".link-card__toggle");
  const list = card.querySelector(".games-list");
  toggle.addEventListener("click", () => {
    const open = list.hidden;
    list.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    card.classList.toggle("is-open", open);
  });
  card.querySelectorAll("[data-soon]").forEach((el) =>
    el.addEventListener("click", () => showToast("Muy pronto disponible"))
  );
  return card;
}

function renderLinks(links) {
  const grid = document.querySelector("#linkGrid");
  grid.innerHTML = "";

  links.forEach((link) => {
    if (Array.isArray(link.games) && link.games.length) {
      grid.appendChild(buildGamesCard(link));
      return;
    }

    if (Array.isArray(link.actions) && link.actions.length) {
      const card = document.createElement("div");
      card.className = "link-card link-card--group";
      card.style.setProperty("--accent", link.accent || "#f8d66d");
      card.innerHTML = `
        <span class="link-card__icon">${renderIcon(link)}</span>
        <span class="link-card__body">
          <h3>${escapeHtml(link.title)}</h3>
          <span class="link-card__actions">
            ${link.actions
              .map(
                (action) =>
                  `<a href="${encodeURI(action.url)}" target="_blank" rel="noreferrer">${escapeHtml(action.label)}</a>`
              )
              .join("")}
          </span>
        </span>
      `;
      grid.appendChild(card);
      return;
    }

    const disabled = isPlaceholder(link.url);
    const element = document.createElement(disabled ? "button" : "a");
    element.className = `link-card${disabled ? " is-disabled" : ""}`;
    element.style.setProperty("--accent", link.accent || "#f8d66d");

    if (disabled) {
      element.type = "button";
      element.addEventListener("click", () => showToast("Link pendiente por configurar"));
    } else {
      element.href = link.url;
      if (!isInternalAnchor(link.url)) {
        element.target = "_blank";
        element.rel = "noreferrer";
      }
    }

    element.innerHTML = `
      <span class="link-card__icon">${renderIcon(link)}</span>
      <span class="link-card__body">
        <h3>${escapeHtml(link.title)}</h3>
        <p>${escapeHtml(link.description)}</p>
      </span>
      <i data-lucide="chevron-right" class="link-card__chevron" aria-hidden="true"></i>
    `;

    grid.appendChild(element);
  });
}

function renderCommunity(community) {
  const wrapper = document.querySelector("#communityLinks");
  wrapper.innerHTML = "";

  community.forEach((item) => {
    const element = document.createElement("a");
    element.className = "community-link";
    element.href = item.url;
    element.target = "_blank";
    element.rel = "noreferrer";
    const icon = isImageAsset(item.icon)
      ? `<img class="community-link__icon" src="${escapeHtml(item.icon)}" alt="" />`
      : `<i data-lucide="${escapeHtml(item.icon || "link")}" aria-hidden="true"></i>`;
    element.innerHTML = `
      ${icon}
      <span>${escapeHtml(item.title)}<small>${escapeHtml(item.handle)}</small></span>
    `;
    wrapper.appendChild(element);
  });
}

function applyConfig(config) {
  activeConfig = config;
  document.title = config.brand;
  document.querySelector(".brand-lockup strong").textContent = config.brand;
  document.querySelector("#appTitle").textContent = config.headline;
  document.querySelector("#tagline").textContent = config.tagline;
  document.querySelector("#tokenAddress").textContent = config.tokenAddress;

  const puf = config.links.find((link) => link.id === "puf");
  const pufCta = document.querySelector("#pufCta");
  if (puf && pufCta && !isPlaceholder(puf.url)) {
    pufCta.href = puf.url;
    const label = pufCta.querySelector("span");
    if (label) label.textContent = puf.title || "Staking RCOL";
  }

  renderAnnouncements(config.announcements || []);
  renderLinks(config.links);
  renderCommunity(config.community || []);
  renderNft(config.nft);
  window.lucide?.createIcons?.();
}

function isImageAsset(value) {
  return typeof value === "string" && /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(value);
}

function renderAnnouncements(items) {
  const carousel = document.querySelector("#annCarousel");
  if (!carousel) return;
  const section = carousel.closest(".ann-section");
  if (!items.length) {
    if (section) section.hidden = true;
    return;
  }
  if (section) section.hidden = false;

  carousel.innerHTML = items
    .map((item) => {
      const accent = item.accent || "#f8d66d";
      const tag = item.url ? "a" : "button";
      const hasBanner = Boolean(item.image);
      const iconIsImage = isImageAsset(item.icon);
      let media;
      if (hasBanner) {
        media = `<img class="ann-card__img" src="${escapeHtml(item.image)}" alt="" loading="lazy" />`;
      } else if (iconIsImage) {
        media = `<span class="ann-card__icon ann-card__icon--image"><img src="${escapeHtml(item.icon)}" alt="" loading="lazy" /></span>`;
      } else {
        media = `<span class="ann-card__icon"><i data-lucide="${escapeHtml(item.icon || "megaphone")}" aria-hidden="true"></i></span>`;
      }
      return `
        <${tag} class="ann-card${hasBanner ? " has-image" : ""}" style="--accent:${accent}"${
        item.url ? ` href="${encodeURI(item.url)}" target="_blank" rel="noreferrer"` : ' type="button" data-soon="1"'
      }>
          ${media}
          <span class="ann-card__body">
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.subtitle || "")}</small>
          </span>
          <i data-lucide="${item.url ? "arrow-up-right" : "clock"}" class="ann-card__go" aria-hidden="true"></i>
        </${tag}>`;
    })
    .join("");

  carousel.querySelectorAll("[data-soon]").forEach((el) =>
    el.addEventListener("click", () => showToast("Muy pronto disponible"))
  );

  startAnnouncementsAutoplay(carousel);
}

// El carrusel avanza solo; se pausa al interactuar o cuando no esta visible.
function startAnnouncementsAutoplay(carousel) {
  const cards = carousel.querySelectorAll(".ann-card");
  if (cards.length < 2) return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  let paused = false;
  let resumeTimer = null;

  setInterval(() => {
    if (paused || carousel.offsetParent === null) return; // pausado o vista oculta
    const gap = parseFloat(getComputedStyle(carousel).gap) || 10;
    const step = cards[0].getBoundingClientRect().width + gap;
    const max = carousel.scrollWidth - carousel.clientWidth;
    // Avanza una tarjeta; muestra la ultima antes de volver al inicio.
    const next = carousel.scrollLeft >= max - 4 ? 0 : Math.min(carousel.scrollLeft + step, max);
    carousel.scrollTo({ left: next, behavior: "smooth" });
  }, 4000);

  const pause = () => {
    paused = true;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      paused = false;
    }, 6000);
  };
  ["pointerdown", "touchstart", "wheel"].forEach((event) =>
    carousel.addEventListener(event, pause, { passive: true })
  );
  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
  });
}

function renderNft(nft) {
  const section = document.querySelector("#section-nft");
  if (!section) return;
  if (!nft) {
    section.hidden = true;
    return;
  }
  section.hidden = false;

  section.querySelector("#nftTitle").textContent = nft.title || "NFT RCOL Genesis";
  section.querySelector("#nftDesc").textContent = nft.description || "";

  const isLive = nft.status === "live";
  const statusBadge = document.querySelector("#nftStatus");
  if (statusBadge) {
    statusBadge.textContent = isLive ? "Disponible" : "Proximamente";
    statusBadge.classList.toggle("is-live", isLive);
  }

  section.querySelector("#nftSupply").textContent = nft.supply
    ? `Edicion limitada de ${nft.supply}`
    : "Edicion limitada";

  // Progreso de acuñacion (placeholder desde config hasta que exista el contrato).
  const supply = Number(nft.supply) || 100;
  const minted = Math.max(0, Math.min(supply, Number(nft.minted) || 0));
  const pct = Math.round((minted / supply) * 100);
  document.querySelector("#nftMintedLabel").textContent = `${minted} / ${supply} acunados`;
  document.querySelector("#nftMintedPct").textContent = `${pct}%`;
  requestAnimationFrame(() => {
    document.querySelector("#nftMintedFill").style.width = `${pct}%`;
  });

  nftConfig = nft;
  renderNftFilters();
  renderNftGallery();

  const benefits = section.querySelector("#nftBenefits");
  benefits.innerHTML = (nft.benefits || [])
    .map(
      (benefit) => `
        <li>
          <span class="nft-benefit__icon"><i data-lucide="${escapeHtml(benefit.icon || "star")}" aria-hidden="true"></i></span>
          <span>
            <strong>${escapeHtml(benefit.title)}</strong>
            <small>${escapeHtml(benefit.description)}</small>
          </span>
        </li>`
    )
    .join("");

  const rarity = section.querySelector("#nftRarity");
  rarity.innerHTML = (nft.rarity || [])
    .map(
      (item) => `
        <div class="nft-tier">
          <span class="nft-tier__name">${escapeHtml(item.tier)}</span>
          <span class="nft-tier__range">${escapeHtml(item.range)}</span>
          <span class="nft-tier__perk">${escapeHtml(item.perk)}</span>
        </div>`
    )
    .join("");
  rarity.parentElement.hidden = !(nft.rarity && nft.rarity.length);

  const cta = section.querySelector("#nftCta");
  cta.querySelector("span").textContent = nft.ctaLabel || (isLive ? "Conseguir NFT" : "Proximamente");
  cta.onclick = () => {
    if (nft.ctaUrl) {
      window.open(nft.ctaUrl, "_blank", "noreferrer");
    } else {
      showToast("Muy pronto podras reclamar tu NFT Genesis");
    }
  };
}

async function copyToken(config) {
  try {
    await navigator.clipboard.writeText(config.tokenAddress);
    showToast("Contrato copiado");
  } catch {
    showToast(config.tokenAddress);
  }
}

// Rasteriza una imagen (mismo origen) a PNG para compartirla como archivo.
async function urlToImageFile(url, name) {
  const image = new Image();
  image.src = url;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || 1200;
  canvas.height = image.naturalHeight || 400;
  canvas.getContext("2d").drawImage(image, 0, 0);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  return blob ? new File([blob], `${name}.png`, { type: "image/png" }) : null;
}

async function shareApp(config) {
  const website = config.links.find((link) => link.id === "website");
  const shareUrl = website?.url || location.href;
  const text = `${config.brand}: ${config.tagline}`;

  // 1) Compartir con imagen (banner) si el dispositivo lo soporta.
  try {
    const file = await urlToImageFile("./assets/rcol-banner-mobile.webp", "rcol-hub");
    if (file && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: config.brand, text: `${text} ${shareUrl}` });
      return;
    }
  } catch (error) {
    if (error?.name === "AbortError") return;
  }

  // 2) Compartir link (MiniKit / nativo / portapapeles).
  try {
    if (MiniKitApi?.share) {
      await MiniKitApi.share({ title: config.brand, text, url: shareUrl });
      return;
    }
    if (navigator.share) {
      await navigator.share({ title: config.brand, text, url: shareUrl });
      return;
    }
    await navigator.clipboard.writeText(`${text} ${shareUrl}`);
    showToast("Link copiado para compartir");
  } catch (error) {
    if (error?.name !== "AbortError") showToast("No se pudo compartir ahora");
  }
}

function updateWorldStatus(installResult) {
  worldAppReady = Boolean(window.WorldApp) || Boolean(installResult?.success);
  renderWorldIdStatus();
  updateHumanityGate();
}

/* ---------- World ID (IDKit + Address Book) ---------- */

let worldIdVerified = false;
let worldIdBusy = false;
let previewIdentity = null; // { address, username } from MiniKit before walletAuth

async function resolveMiniKitIdentity() {
  if (!MiniKitApi) return null;

  let address = MiniKitApi.user?.walletAddress;
  let username = MiniKitApi.user?.username;
  let profilePictureUrl = MiniKitApi.user?.profilePictureUrl || null;

  for (let attempt = 0; attempt < 4 && !address; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 280));
    address = MiniKitApi.user?.walletAddress;
    username = MiniKitApi.user?.username;
    profilePictureUrl = MiniKitApi.user?.profilePictureUrl || profilePictureUrl;
  }

  if (!address && typeof MiniKitApi.getUserInfo === "function") {
    try {
      const info = await MiniKitApi.getUserInfo();
      address = info?.walletAddress ?? info?.address;
      username = username ?? info?.username;
      profilePictureUrl = profilePictureUrl || info?.profilePictureUrl || null;
    } catch {}
  }

  if (address && typeof MiniKitApi.getUserByAddress === "function") {
    try {
      const user = await MiniKitApi.getUserByAddress(address);
      username = username || user?.username;
      profilePictureUrl = profilePictureUrl || user?.profilePictureUrl || null;
    } catch {}
  }

  if (!address) return null;
  return { address, username: username || null, profilePictureUrl };
}

async function syncOrbVerification() {
  if (readSessionVerified()) {
    worldIdVerified = true;
    hideWorldIdModal();
    renderWorldIdStatus();
    return true;
  }

  // En World App la entrada exige prueba World ID (accion rcol-hub-access), no solo Address Book.
  if (worldAppReady) {
    worldIdVerified = false;
    renderWorldIdStatus();
    return false;
  }

  const identity = walletState || previewIdentity || (await resolveMiniKitIdentity());
  if (identity && !walletState) previewIdentity = identity;

  const address = walletState?.address || previewIdentity?.address;
  if (!address) {
    worldIdVerified = false;
    renderWorldIdStatus();
    return false;
  }

  const orb = await checkOrbVerified(address);
  worldIdVerified = orb;
  if (orb) {
    writeSessionVerified(true);
    hideWorldIdModal();
  }
  renderWorldIdStatus();
  updateHumanityGate();
  return orb;
}

async function refreshWorldIdStatus() {
  return syncOrbVerification();
}

function readSessionVerified() {
  try {
    if (sessionStorage.getItem(WORLD_ID_STORAGE_KEY) === "1") return true;
    return Boolean(sessionStorage.getItem(WORLD_ID_NULLIFIER_KEY));
  } catch {
    return false;
  }
}

function writeSessionVerified(value) {
  try {
    if (value) sessionStorage.setItem(WORLD_ID_STORAGE_KEY, "1");
    else {
      sessionStorage.removeItem(WORLD_ID_STORAGE_KEY);
      sessionStorage.removeItem(WORLD_ID_NULLIFIER_KEY);
    }
  } catch {}
}

function storeNullifier(nullifier) {
  if (!nullifier) return;
  try {
    sessionStorage.setItem(WORLD_ID_NULLIFIER_KEY, nullifier);
  } catch {}
}

function updateHumanityGate() {
  const shell = document.querySelector(".app-shell");
  if (!shell) return;
  const locked = worldAppReady && !worldIdVerified;
  shell.classList.toggle("is-humanity-locked", locked);
  document.body.classList.toggle("is-humanity-locked", locked);
}

async function checkOrbVerified(address) {
  if (!address) return false;
  try {
    const mod = await import("https://cdn.jsdelivr.net/npm/@worldcoin/minikit-js@2.0.3/address-book/+esm");
    if (mod?.getIsUserVerified) return mod.getIsUserVerified(address, WORLDCHAIN_RPC);
  } catch {}
  try {
    const data = ADDRESS_BOOK_SELECTOR + pad32(address.slice(2));
    const result = await ethCall(ADDRESS_BOOK, data);
    if (!result || result === "0x") return false;
    return BigInt(result) > BigInt(Math.floor(Date.now() / 1000));
  } catch {
    return false;
  }
}

function renderWorldIdStatus() {
  const status = document.querySelector("#worldStatus");
  if (!status) return;

  status.classList.toggle("is-ready", worldAppReady);
  status.classList.toggle("is-browser", !worldAppReady);
  status.classList.toggle("is-verified", worldAppReady && worldIdVerified);
  status.classList.toggle("is-unverified", worldAppReady && !worldIdVerified);

  const label = status.querySelector("span:last-child");
  if (!worldAppReady) {
    label.textContent = "Modo navegador";
  } else if (worldIdVerified) {
    const user = walletState?.username || previewIdentity?.username;
    label.textContent = user ? `Humano verificado · @${user}` : "Humano verificado";
  } else {
    label.textContent = "World App detectado";
  }

  const modalCta = document.querySelector("#worldIdModalApprove");
  if (modalCta) {
    modalCta.classList.toggle("is-busy", worldIdBusy);
    modalCta.querySelector("span").textContent = worldIdBusy ? "Verificando..." : "Aprobar";
  }
  updateHumanityGate();
}

function showWorldIdModal() {
  const modal = document.querySelector("#worldIdModal");
  if (!modal) return;
  modal.hidden = false;
  document.body.classList.remove("is-worldid-native");
  setWorldIdModalHint("Despues World App te pedira confirmar — tu privacidad queda protegida.");
  window.lucide?.createIcons?.();
}

function hideWorldIdModal() {
  document.querySelector("#worldIdModal")?.setAttribute("hidden", "");
  document.body.classList.remove("is-worldid-native");
}

function showWorldIdVerifyingOverlay() {
  document.body.classList.add("is-worldid-native");
}

async function maybeShowWorldIdModal() {
  if (!worldAppReady) return;
  if (await syncOrbVerification()) {
    updateHumanityGate();
    return;
  }
  showWorldIdModal();
  updateHumanityGate();
}

async function onHumanityVerified(nullifier) {
  if (nullifier) storeNullifier(nullifier);
  worldIdVerified = true;
  writeSessionVerified(true);
  hideWorldIdModal();
  renderWorldIdStatus();
  if (!walletState) await connectWallet();
  showToast("Humano verificado con World ID");
}

async function launchWorldId() {
  const config = activeConfig || fallbackConfig;
  if (!worldAppReady) {
    showToast("Abre RCOL Hub en World App para verificar");
    return false;
  }
  if (worldIdVerified) {
    hideWorldIdModal();
    return true;
  }
  if (worldIdBusy) return false;

  const action = config.worldIdAction || "rcol-hub-access";
  const appId = config.worldIdAppId;
  const rpId = config.worldIdRpId;
  if (!appId || !rpId) {
    showToast("World ID no configurado");
    return false;
  }

  worldIdBusy = true;
  renderWorldIdStatus();

  try {
    await ensureMiniKitReady(appId);

    const sigRes = await fetch(`/api/world-id/sign?action=${encodeURIComponent(action)}`);
    const signBody = await sigRes.json().catch(() => ({}));
    if (!sigRes.ok) {
      throw new Error(signBody.error || "sign_failed");
    }

    const rpContext = signBody.rp_context;
    if (!rpContext?.signature) {
      throw new Error("sign_failed");
    }

    hideWorldIdModal();
    showWorldIdVerifyingOverlay();

    const { runWorldIdVerify } = await import("./world-id-widget.js");
    const nullifier = await runWorldIdVerify({
      appId,
      action,
      rpContext,
      signal: walletState?.address || previewIdentity?.address || ""
    });

    await onHumanityVerified(nullifier);
    return true;
  } catch (error) {
    console.error("World ID verify error:", error);
    document.body.classList.remove("is-worldid-native");
    const msg = worldIdErrorMessage(error);
    showToast(msg, 4500);
    setWorldIdModalHint(msg);
    if (worldAppReady && !worldIdVerified) showWorldIdModal();
    return false;
  } finally {
    document.body.classList.remove("is-worldid-native");
    worldIdBusy = false;
    renderWorldIdStatus();
  }
}

function setupWorldId() {
  document.querySelector("#worldIdModalApprove")?.addEventListener("click", launchWorldId);
  worldIdVerified = readSessionVerified();
  renderWorldIdStatus();
  updateHumanityGate();
}

/* ---------- Wallet del usuario (nombre + saldo) ---------- */

let walletState = null; // { address, username }

function shortAddress(address) {
  const a = String(address || "");
  if (a.length < 12) return a || "—";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function renderWallet() {
  const button = document.querySelector("#walletButton");
  const nameEl = document.querySelector("#walletName");
  if (!button || !nameEl) return;
  if (walletState) {
    button.classList.add("is-connected");
    nameEl.textContent = walletState.username ? `@${walletState.username}` : shortAddress(walletState.address);
    button.setAttribute("aria-label", "Wallet conectada");
  } else {
    button.classList.remove("is-connected");
    nameEl.textContent = "Conectar";
    button.setAttribute("aria-label", "Conectar wallet");
  }
  // El boton de swap refleja si hay que conectar primero (capa de seguridad).
  const cta = document.querySelector("#swapCta");
  if (cta && !cta.disabled) {
    cta.querySelector("span").textContent = walletState ? "Swap ahora" : "Conecta tu wallet";
  }
}

async function connectWallet() {
  if (walletState) return true;
  if (!worldAppReady || !MiniKitApi) {
    showToast("Abre el hub en World App para conectar");
    return false;
  }
  // nonce: >= 8 caracteres alfanumericos (lo exige MiniKit v2).
  const nonce = (Date.now().toString(36) + Math.random().toString(36).slice(2)).replace(/[^a-z0-9]/gi, "").slice(0, 24);
  try {
    const res = await MiniKitApi.walletAuth({ nonce, statement: "Conecta tu wallet en RCOL Hub" });
    console.log("walletAuth result:", JSON.stringify(res));
    // v2 envuelve: { executedWith:"minikit", data:{address,message,signature,version} }
    const data = res?.data || res?.finalPayload || res;
    const address = data?.address || MiniKitApi.user?.walletAddress;
    if (!address) throw new Error(JSON.stringify(data) || "sin direccion");

    let username = MiniKitApi.user?.username;
    let profilePictureUrl = MiniKitApi.user?.profilePictureUrl || null;
    try {
      const user = await MiniKitApi.getUserByAddress?.(address);
      username = username || user?.username;
      profilePictureUrl = profilePictureUrl || user?.profilePictureUrl || null;
    } catch {}
    walletState = { address, username, profilePictureUrl };
    renderWallet();
    updateSwapBalance();
    if (!document.querySelector("#swapView")?.hidden) renderSwapView();
    await syncOrbVerification();
    if (!worldIdVerified) showWorldIdModal();
    showToast(username ? `Hola @${username}` : "Wallet conectada");
    updateSendBalance();
    refreshReceiveQr();
    const sendCta = document.querySelector("#sendCta span");
    if (sendCta) sendCta.textContent = "Enviar RCOL";
    return true;
  } catch (error) {
    console.error("walletAuth error:", error);
    const message = error?.message || error?.error_code || String(error);
    if (/reject|cancel|denied/i.test(message)) showToast("Conexion cancelada");
    else showToast(`No se pudo conectar: ${message}`);
    return false;
  }
}

async function getTokenBalanceRaw(tokenAddress, owner) {
  const data = `0x70a08231${pad32(owner.slice(2))}`;
  const result = await ethCall(tokenAddress, data);
  if (!result || result === "0x") return 0n;
  return BigInt(result);
}

let walletBalanceStr = "0"; // saldo exacto del token "Pagas" (para MAX)

async function updateSwapBalance() {
  const maxButton = document.querySelector("#swapMax");
  const valEl = document.querySelector("#swapBalanceVal");
  if (!maxButton || !valEl) return;
  if (!walletState) {
    maxButton.hidden = true;
    return;
  }
  const fromSym = document.querySelector("#swapFrom")?.value;
  const token = tokenBySymbol[fromSym];
  if (!token) return;
  maxButton.hidden = false;
  try {
    const raw = await getTokenBalanceRaw(token.address, walletState.address);
    walletBalanceStr = fromBaseUnits(raw, token.decimals);
    valEl.textContent = `${formatTokenAmount(Number(walletBalanceStr))} ${fromSym}`;
  } catch {
    valEl.textContent = "—";
  }
}

function setupWallet() {
  document.querySelector("#walletButton")?.addEventListener("click", connectWallet);
  document.querySelector("#swapConnectBtn")?.addEventListener("click", connectWallet);
  document.querySelector("#swapMax")?.addEventListener("click", () => {
    if (!walletState || !(Number(walletBalanceStr) > 0)) return;
    const input = document.querySelector("#swapAmount");
    input.value = walletBalanceStr;
    input.dispatchEvent(new Event("input"));
  });
  document.querySelector("#walletRefresh")?.addEventListener("click", () => {
    if (!walletState) return;
    const icon = document.querySelector("#walletRefresh");
    icon?.classList.add("is-spinning");
    Promise.resolve(fetchAllBalances()).finally(() =>
      setTimeout(() => icon?.classList.remove("is-spinning"), 600)
    );
  });
  document.querySelector("#walletHistory")?.addEventListener("click", () => {
    const section = document.querySelector("#txHistory");
    if (!section) return;
    renderTxHistory();
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    if (section.hidden) showToast("Aun no hay actividad para mostrar");
  });
  document.querySelector("#walletAddrCopy")?.addEventListener("click", async () => {
    if (!walletState) return;
    try {
      await navigator.clipboard.writeText(walletState.address);
      showToast("Dirección copiada");
    } catch {
      showToast(walletState.address);
    }
  });
  renderWallet();
}

/* ---------- Tema claro / oscuro ---------- */

function setupTheme() {
  const meta = document.querySelector('meta[name="theme-color"]');
  const apply = (theme) => {
    document.documentElement.dataset.theme = theme;
    meta?.setAttribute("content", theme === "light" ? "#f6f2e8" : "#080704");
  };

  apply(document.documentElement.dataset.theme || "dark");

  document.querySelector("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    apply(next);
    try {
      localStorage.setItem("rcol-theme", next);
    } catch {}
  });
}

/* ---------- Datos de mercado ---------- */

function setStat(id, value) {
  const node = document.querySelector(`#${id}`);
  if (node && value != null) node.textContent = value;
}

function abbreviate(value) {
  if (value == null || !isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(abs < 1 ? 4 : 2);
}

function formatUsd(value) {
  if (value == null || !isFinite(value)) return "—";
  return `$${abbreviate(value)}`;
}

function formatPrice(value) {
  const num = Number(value);
  if (!isFinite(num) || num <= 0) return "—";
  if (num >= 1) return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (num >= 0.01) return num.toFixed(4);
  return num.toFixed(Math.min(12, Math.ceil(-Math.log10(num)) + 3));
}

function formatTokenAmount(value) {
  if (!isFinite(value) || value <= 0) return "0.0";
  if (value >= 1e6) return abbreviate(value);
  if (value >= 1) return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  const decimals = Math.min(12, Math.ceil(-Math.log10(value)) + 3);
  return value.toFixed(decimals).replace(/0+$/, "").replace(/\.$/, "");
}

async function rpcCall(data) {
  const response = await fetch(WORLDCHAIN_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [{ to: RCOL_ADDRESS, data }, "latest"]
    })
  });
  const json = await response.json();
  return json.result;
}

function hexToTokens(hex, decimals = RCOL_DECIMALS) {
  if (!hex || hex === "0x") return 0;
  return Number(BigInt(hex)) / 10 ** decimals;
}

async function fetchDexData() {
  const addresses = SWAP_TOKENS.map((token) => token.address).join(",");
  const response = await fetch(`${DEXSCREENER_TOKENS_API}${addresses}`);
  const data = await response.json();
  const pairs = Array.isArray(data) ? data : data.pairs || [];

  const bestPairFor = (address) =>
    pairs
      .filter(
        (pair) =>
          pair.baseToken?.address?.toLowerCase() === address.toLowerCase() &&
          Number(pair.priceUsd) > 0
      )
      .sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];

  SWAP_TOKENS.forEach((token) => {
    const pair = bestPairFor(token.address);
    if (pair) tokenPrices[token.symbol] = Number(pair.priceUsd);
  });
  if (!tokenPrices.USDC) tokenPrices.USDC = 1;

  const rcolPair = bestPairFor(RCOL_ADDRESS);
  if (rcolPair) {
    setStat("statMcap", formatUsd(rcolPair.marketCap ?? rcolPair.fdv));
    setStat("statLiq", formatUsd(rcolPair.liquidity?.usd));
    setStat("statPrice", `1 RCOL ≈ $${formatPrice(rcolPair.priceUsd)}`);
    setStat("priceNow", `$${formatPrice(rcolPair.priceUsd)}`);
    renderPriceChange(rcolPair.priceChange?.h24);
  }

  scheduleQuote();
}

function renderPriceChange(change) {
  const badge = document.querySelector("#priceChange24");
  if (!badge || change == null || !isFinite(change)) return;
  const up = change >= 0;
  badge.textContent = `${up ? "▲" : "▼"} ${Math.abs(change).toFixed(2)}% 24h`;
  badge.style.setProperty("--spark", up ? "#15d982" : "#ff4d6d");
  const hero = document.querySelector("#priceHero");
  if (hero) hero.style.setProperty("--spark", up ? "#15d982" : "#ff4d6d");
}

async function fetchPriceChart() {
  const response = await fetch(GECKO_OHLCV_API, { headers: { Accept: "application/json" } });
  if (!response.ok) return;
  const json = await response.json();
  const list = json?.data?.attributes?.ohlcv_list || [];
  // GeckoTerminal devuelve [ts, open, high, low, close, volume], mas reciente primero.
  const closes = list
    .map((candle) => Number(candle[4]))
    .filter((value) => isFinite(value) && value > 0)
    .reverse();
  if (closes.length >= 2) renderSparkline(closes);
}

function renderSparkline(values) {
  const line = document.querySelector("#sparkLine");
  const area = document.querySelector("#sparkArea");
  if (!line || !area) return;

  const width = 100;
  const height = 40;
  const pad = 3;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = width / (values.length - 1);

  const points = values.map((value, i) => {
    const x = i * stepX;
    const y = pad + (1 - (value - min) / span) * (height - pad * 2);
    return [x, y];
  });

  const linePath = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  line.setAttribute("d", linePath);
  area.setAttribute("d", `${linePath} L${width} ${height} L0 ${height} Z`);

  // Color del trazo segun la tendencia del periodo mostrado.
  const up = values[values.length - 1] >= values[0];
  const hero = document.querySelector("#priceHero");
  if (hero && document.querySelector("#priceChange24")?.textContent === "24h") {
    hero.style.setProperty("--spark", up ? "#15d982" : "#ff4d6d");
  }
}

async function fetchHolders() {
  const response = await fetch(`${EXPLORER_TOKEN_API}${RCOL_ADDRESS}`);
  const data = await response.json();
  const holders = Number(data.holders_count ?? data.holders);
  if (holders > 0) setStat("statHolders", holders.toLocaleString("es-CO"));
}

async function fetchBurned() {
  const balanceCalls = BURN_ADDRESSES.map((address) =>
    rpcCall(`0x70a08231${address.slice(2).toLowerCase().padStart(64, "0")}`)
  );
  const [supplyHex, ...balances] = await Promise.all([rpcCall("0x18160ddd"), ...balanceCalls]);

  const burned = balances.reduce((total, hex) => total + hexToTokens(hex), 0);
  const supply = hexToTokens(supplyHex);

  setStat("statBurn", `${abbreviate(burned)} RCOL`);
  if (supply > 0 && burned > 0) {
    setStat("statBurnPct", `${((burned / supply) * 100).toFixed(2)}% del suministro`);
  }
}

function loadMarketData() {
  Promise.allSettled([fetchDexData(), fetchHolders(), fetchBurned(), fetchPriceChart()]);
}

/* ---------- Motor de swap (Uniswap v2 directo + MiniKit) ---------- */

// MiniKit v2 exige calldata pre-codificado ({ to, data }). Codificamos a mano.
const PERMIT2_APPROVE_SELECTOR = "87517c45"; // approve(address,address,uint160,uint48)
const UR_EXECUTE_SELECTOR = "3593564c"; // execute(bytes,bytes[],uint256)

const tokenBySymbol = Object.fromEntries(SWAP_TOKENS.map((token) => [token.symbol, token]));
let lastQuote = null;
let quoteTimer = null;
let quoteSeq = 0;

function openStakingApp() {
  window.open(STAKING_APP_URL, "_blank", "noreferrer");
}

function isValidAddress(value) {
  return /^0x[0-9a-fA-F]{40}$/.test(String(value || "").trim());
}

function encodeErc20Transfer(to, amount) {
  return `0xa9059cbb${pad32(to.slice(2))}${pad32(amount.toString(16))}`;
}

function minikitTxErrorMessage(error, fallback = "Error de transaccion") {
  const code = String(
    error?.code || error?.error_code || error?.details?.error_code || ""
  ).trim();
  const map = {
    user_rejected: "Cancelado",
    simulation_failed: "La simulacion fallo (saldo, gas o el token rechazo el envio)",
    transaction_failed: "La transaccion fallo en cadena",
    generic_error: "World App rechazo la operacion",
    invalid_contract: "Contrato no permitido en el portal de World",
    malicious_operation: "World App bloqueo la operacion por seguridad",
    disallowed_operation: "Operacion no permitida por World App",
    validation_error: "La transaccion no paso la validacion",
    input_error: "Datos de transaccion invalidos",
    daily_tx_limit_reached: "Limite diario de transacciones alcanzado",
    invalid_operation: "Operacion invalida"
  };
  if (code && map[code]) return `${map[code]} (${code})`;
  const message = String(error?.message || error || "").trim();
  if (/reject|cancel|denied/i.test(message)) return "Cancelado";
  if (message) return message;
  return fallback;
}

async function sendRcolTransfer(to, amountWei) {
  const transferData = encodeErc20Transfer(to, amountWei);
  // Preflight: si revierte on-chain, no abrimos MiniKit con un fallo opaco.
  if (walletState?.address) {
    try {
      await ethCall(RCOL_ADDRESS, transferData, walletState.address);
    } catch (error) {
      const detail = String(error?.message || error || "");
      throw new Error(
        /insufficient|transfer amount|exceeds balance|ERC20/i.test(detail)
          ? "Saldo insuficiente o el token rechazo la transferencia"
          : `Simulacion fallo: ${detail || "revert"}`
      );
    }
  }
  const result = await MiniKitApi.sendTransaction({
    chainId: 480,
    transactions: [{ to: RCOL_ADDRESS, value: "0x0", data: transferData }]
  });
  return result;
}

// PUF quema con helper+Permit2 (no transfer ERC20 directo a dead — World lo bloquea).
// Aqui usamos el mismo patron MiniKit v2 del swap: Permit2.approve + Universal Router.
function encodePermit2TransferFromInput(token, recipient, amount) {
  // abi.encode(address token, address recipient, uint160 amount)
  return "0x" + pad32(token.slice(2)) + pad32(recipient.slice(2)) + pad32(amount.toString(16));
}

async function burnRcolViaPermit2(amountWei) {
  const maxUint160 = (1n << 160n) - 1n;
  if (amountWei <= 0n) throw new Error("Cantidad invalida");
  if (amountWei > maxUint160) throw new Error("Cantidad demasiado grande para Permit2");

  const deadline = BigInt(Math.floor(Date.now() / 1000) + SWAP_DEADLINE_MIN * 60);
  const approveData = encodePermit2Approve(RCOL_ADDRESS, UNIVERSAL_ROUTER, amountWei, 0n);
  const transferInput = encodePermit2TransferFromInput(RCOL_ADDRESS, BURN_ADDRESSES[0], amountWei);
  const executeData = encodeUniversalRouterExecute(PERMIT2_TRANSFER_FROM, transferInput, deadline);

  return MiniKitApi.sendTransaction({
    chainId: 480,
    transactions: [
      { to: PERMIT2, value: "0x0", data: approveData },
      { to: UNIVERSAL_ROUTER, value: "0x0", data: executeData }
    ]
  });
}

// Convierte un monto decimal en unidades enteras (wei) segun los decimales del token.
function toBaseUnits(amountStr, decimals) {
  const clean = String(amountStr).trim().replace(/,/g, ".");
  if (!/^\d*\.?\d*$/.test(clean) || clean === "" || clean === ".") return 0n;
  const [intPart, fracPart = ""] = clean.split(".");
  const frac = (fracPart + "0".repeat(decimals)).slice(0, decimals);
  return BigInt((intPart || "0") + frac);
}

function fromBaseUnits(value, decimals) {
  const s = value.toString().padStart(decimals + 1, "0");
  const intPart = s.slice(0, s.length - decimals);
  const fracPart = s.slice(s.length - decimals).replace(/0+$/, "");
  return fracPart ? `${intPart}.${fracPart}` : intPart;
}

function pad32(hexNoPrefix) {
  return hexNoPrefix.toLowerCase().padStart(64, "0");
}

// Ruta de swap: RCOL solo tiene pool contra WLD, todo lo demas pasa por WLD.
function buildPath(fromSym, toSym) {
  const a = tokenBySymbol[fromSym].address;
  const b = tokenBySymbol[toSym].address;
  if (fromSym === "WLD" || toSym === "WLD") return [a, b];
  return [a, WLD_ADDRESS, b];
}

async function ethCall(to, data, from) {
  const tx = from ? { from, to, data } : { to, data };
  const response = await fetch(WORLDCHAIN_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_call", params: [tx, "latest"] })
  });
  const json = await response.json();
  if (json.error) throw new Error(json.error.message || "eth_call error");
  return json.result;
}

// getAmountsOut(uint256, address[]) on-chain: cotizacion real ejecutable.
async function quoteAmountOut(amountInWei, path) {
  const head = pad32(amountInWei.toString(16)) + pad32("40") + pad32(path.length.toString(16));
  const addrs = path.map((addr) => pad32(addr.slice(2))).join("");
  const data = "0xd06ca61f" + head + addrs;
  const result = await ethCall(UNISWAP_V2_ROUTER, data);
  if (!result || result === "0x") return null;
  const last = result.slice(2).slice(-64);
  return BigInt("0x" + last);
}

// Codifica el input del comando V2_SWAP_EXACT_IN del Universal Router:
// (address recipient, uint256 amountIn, uint256 amountOutMin, address[] path, bool payerIsUser)
function encodeV2SwapInput(recipient, amountIn, minOut, path) {
  const head =
    pad32(recipient.slice(2)) +
    pad32(amountIn.toString(16)) +
    pad32(minOut.toString(16)) +
    pad32("a0") +
    pad32("1"); // payerIsUser = true: jala los tokens de quien firma via Permit2
  const tail = pad32(path.length.toString(16)) + path.map((addr) => pad32(addr.slice(2))).join("");
  return "0x" + head + tail;
}

// Calldata de Permit2.approve(token, spender, amount uint160, expiration uint48).
function encodePermit2Approve(token, spender, amount, expiration) {
  return (
    "0x" +
    PERMIT2_APPROVE_SELECTOR +
    pad32(token.slice(2)) +
    pad32(spender.slice(2)) +
    pad32(amount.toString(16)) +
    pad32(expiration.toString(16))
  );
}

// Empaqueta unos bytes dinamicos: longitud (32) + datos rellenados a multiplo de 32.
function encodeDynBytes(hexNoPrefix) {
  const lenWord = pad32((hexNoPrefix.length / 2).toString(16));
  const padded = hexNoPrefix + "0".repeat((64 - (hexNoPrefix.length % 64)) % 64);
  return lenWord + padded;
}

// Calldata de UniversalRouter.execute(bytes commands, bytes[] inputs, uint256 deadline).
function encodeUniversalRouterExecute(commandHex, inputHex, deadline) {
  const commandsTail = encodeDynBytes(commandHex.replace(/^0x/, ""));
  const inputElem = encodeDynBytes(inputHex.replace(/^0x/, ""));
  const offCommands = 0x60;
  const offInputs = offCommands + commandsTail.length / 2;
  // inputs (bytes[]): longitud del arreglo + offset al primer elemento + elemento.
  const inputsTail = pad32("1") + pad32("20") + inputElem;
  const head = pad32(offCommands.toString(16)) + pad32(offInputs.toString(16)) + pad32(deadline.toString(16));
  return "0x" + UR_EXECUTE_SELECTOR + head + commandsTail + inputsTail;
}

/* ---------- Swap ---------- */

function setupSwap() {
  const fromSelect = document.querySelector("#swapFrom");
  const toSelect = document.querySelector("#swapTo");
  const amountInput = document.querySelector("#swapAmount");
  const invertButton = document.querySelector("#swapInvert");
  const ctaButton = document.querySelector("#swapCta");

  const fillOptions = (select, selected) => {
    select.innerHTML = SWAP_TOKENS.map(
      (token) => `<option value="${token.symbol}"${token.symbol === selected ? " selected" : ""}>${token.symbol}</option>`
    ).join("");
  };

  fillOptions(fromSelect, "WLD");
  fillOptions(toSelect, "RCOL");

  // Un lado del swap siempre es RCOL: se cambian tokens verificados por RCOL o al reves.
  const enforcePair = (changed) => {
    const other = changed === fromSelect ? toSelect : fromSelect;
    if (fromSelect.value !== "RCOL" && toSelect.value !== "RCOL") other.value = "RCOL";
    if (fromSelect.value === "RCOL" && toSelect.value === "RCOL") other.value = "WLD";
  };

  fromSelect.addEventListener("change", () => {
    enforcePair(fromSelect);
    scheduleQuote();
    updateSwapBalance();
  });
  toSelect.addEventListener("change", () => {
    enforcePair(toSelect);
    scheduleQuote();
  });
  amountInput.addEventListener("input", scheduleQuote);

  invertButton.addEventListener("click", () => {
    const previousFrom = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = previousFrom;
    scheduleQuote();
    updateSwapBalance();
  });

  const ctaLabel = ctaButton.querySelector("span");
  const setCta = (text, disabled) => {
    ctaLabel.textContent = text;
    ctaButton.disabled = disabled;
    ctaButton.classList.toggle("is-busy", disabled);
  };

  // El swap se firma y ejecuta DENTRO de RCOL Hub via Uniswap v2 (Universal
  // Router + Permit2) con la wallet de World App.
  ctaButton.addEventListener("click", async () => {
    const fromSym = fromSelect.value;
    const toSym = toSelect.value;
    const amount = parseFloat(amountInput.value);

    if (!worldAppReady || !MiniKitApi) {
      showToast("Abre el hub en World App para firmar el swap");
      return;
    }

    // Capa de seguridad: exige conectar la wallet antes de poder swappear.
    if (!walletState) {
      const connected = await connectWallet();
      if (!connected) return;
    }

    if (!(amount > 0)) {
      showToast("Ingresa una cantidad para cambiar");
      amountInput.focus();
      return;
    }

    const fromToken = tokenBySymbol[fromSym];
    const path = buildPath(fromSym, toSym);
    const amountInWei = toBaseUnits(amountInput.value, fromToken.decimals);

    try {
      setCta("Cotizando...", true);
      const amountOut = await quoteAmountOut(amountInWei, path);
      if (!amountOut || amountOut === 0n) {
        showToast("Sin liquidez para ese par ahora");
        return;
      }
      const minOut = (amountOut * (10000n - SWAP_SLIPPAGE_BPS)) / 10000n;
      const deadline = BigInt(Math.floor(Date.now() / 1000) + SWAP_DEADLINE_MIN * 60);
      const swapInput = encodeV2SwapInput(UR_MSG_SENDER, amountInWei, minOut, path);

      // MiniKit v2: calldata pre-codificado, transactions (plural), expiration 0 en Permit2.approve.
      const approveData = encodePermit2Approve(fromToken.address, UNIVERSAL_ROUTER, amountInWei, 0n);
      const executeData = encodeUniversalRouterExecute(V2_SWAP_EXACT_IN, swapInput, deadline);

      setCta("Confirma en tu wallet...", true);
      const result = await MiniKitApi.sendTransaction({
        chainId: 480,
        transactions: [
          { to: PERMIT2, data: approveData },
          { to: UNIVERSAL_ROUTER, data: executeData }
        ]
      });

      // v2 resuelve con los datos en exito y LANZA en error (lo captura el catch).
      console.log("RCOL swap result:", result);
      const outNum = Number(fromBaseUnits(amountOut, tokenBySymbol[toSym].decimals));
      const txHash = result?.transaction_id || result?.transactionId || result?.hash || null;
      saveTxToHistory(fromSym, toSym, amount, outNum, txHash);
      showToast(`Swap enviado: ${amount} ${fromSym} a ${toSym}`);
      amountInput.value = "";
      renderQuote(null);
      renderTxHistory();
      setTimeout(loadMarketData, 12000);
      setTimeout(updateSwapBalance, 12000);
    } catch (error) {
      console.error("Swap error:", error);
      const message = error?.message || error?.error_code || String(error);
      if (/reject|cancel|denied/i.test(message)) {
        showToast("Swap cancelado");
      } else {
        showToast(`Swap fallo: ${message}`);
      }
    } finally {
      setCta(walletState ? "Swap ahora" : "Conecta tu wallet", false);
    }
  });

  setupSendRcol();
  setupBurnRcol();
  setupWalletMode();
  updateSwapTeaser();
  refreshSwapRate();
  scheduleQuote();
}

function setWalletMode(mode) {
  try {
    const isSend = mode === "send";
    const isBurn = mode === "burn";
    const isSwap = !isSend && !isBurn;
    const swapPanel = document.querySelector("#section-swap");
    const sendPanel = document.querySelector("#section-send");
    const burnPanel = document.querySelector("#section-burn");
    const rateRow = document.querySelector("#swapRate");
    const title = document.querySelector(".swap-view .view-topbar strong");
    const swapBtn = document.querySelector("#modeSwapBtn");
    const sendBtn = document.querySelector("#modeSendBtn");
    const burnBtn = document.querySelector("#modeBurnBtn");

    if (swapPanel) swapPanel.hidden = !isSwap;
    if (sendPanel) sendPanel.hidden = !isSend;
    if (burnPanel) burnPanel.hidden = !isBurn;
    if (rateRow) rateRow.hidden = !isSwap || !rateRow.dataset.hasRate;
    renderTxHistory();

    if (title) {
      title.textContent = isBurn ? "Quemar RCOL" : isSend ? "Enviar" : "Swap RCOL";
    }
    if (swapBtn) {
      swapBtn.classList.toggle("is-active", isSwap);
      swapBtn.setAttribute("aria-selected", String(isSwap));
    }
    if (sendBtn) {
      sendBtn.classList.toggle("is-active", isSend);
      sendBtn.setAttribute("aria-selected", String(isSend));
    }
    if (burnBtn) burnBtn.classList.toggle("is-active", isBurn);

    if (isSend) {
      updateSendBalance();
      refreshReceiveQr();
    } else if (isBurn) updateBurnBalance();
    else scheduleQuote();
    window.lucide?.createIcons?.();
  } catch (error) {
    console.error("setWalletMode error:", error);
    showToast(String(error?.message || error || "No se pudo cambiar de modo"), 4000);
  }
}

function setupWalletMode() {
  document.querySelector("#modeSwapBtn")?.addEventListener("click", () => setWalletMode("swap"));
  document.querySelector("#modeSendBtn")?.addEventListener("click", () => setWalletMode("send"));
  document.querySelector("#modeBurnBtn")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setWalletMode("burn");
  });
  setWalletMode("swap");
}

let sendBalanceStr = "0";
let selectedSendContact = null; // { username, walletAddress }
let payPane = "send"; // send | receive

async function updateSendBalance() {
  const maxButton = document.querySelector("#sendMax");
  const valEl = document.querySelector("#sendBalanceVal");
  if (!maxButton || !valEl) return;
  if (!walletState) {
    maxButton.hidden = true;
    return;
  }
  maxButton.hidden = false;
  try {
    const raw = await getTokenBalanceRaw(RCOL_ADDRESS, walletState.address);
    sendBalanceStr = fromBaseUnits(raw, RCOL_DECIMALS);
    valEl.textContent = formatTokenAmount(Number(sendBalanceStr));
  } catch {
    valEl.textContent = "—";
  }
}

function setSelectedSendContact(contact) {
  selectedSendContact = contact;
  const chip = document.querySelector("#sendContactChip");
  const nameEl = document.querySelector("#sendContactName");
  const toInput = document.querySelector("#sendTo");
  if (!chip || !nameEl || !toInput) return;
  if (contact?.walletAddress) {
    toInput.value = contact.walletAddress;
    nameEl.textContent = contact.username ? `@${contact.username}` : shortAddress(contact.walletAddress);
    chip.hidden = false;
  } else {
    chip.hidden = true;
    nameEl.textContent = "—";
  }
  window.lucide?.createIcons?.();
}

function setPayPane(mode) {
  payPane = mode === "receive" ? "receive" : "send";
  const sendPane = document.querySelector("#paySendPane");
  const receivePane = document.querySelector("#payReceivePane");
  const sendBtn = document.querySelector("#payActSend");
  const receiveBtn = document.querySelector("#payActReceive");
  const contactsBtn = document.querySelector("#payActContacts");

  if (sendPane) sendPane.hidden = payPane !== "send";
  if (receivePane) receivePane.hidden = payPane !== "receive";
  if (sendBtn) {
    sendBtn.classList.toggle("is-active", payPane === "send");
    sendBtn.setAttribute("aria-selected", String(payPane === "send"));
  }
  if (receiveBtn) {
    receiveBtn.classList.toggle("is-active", payPane === "receive");
    receiveBtn.setAttribute("aria-selected", String(payPane === "receive"));
  }
  if (contactsBtn) {
    contactsBtn.classList.toggle("is-active", false);
    contactsBtn.setAttribute("aria-selected", "false");
  }
  if (payPane === "receive") refreshReceiveQr();
  window.lucide?.createIcons?.();
}

function buildReceivePayload() {
  if (!walletState?.address) return null;
  const amount = String(document.querySelector("#receiveAmount")?.value || "").trim();
  const params = new URLSearchParams({ to: walletState.address, token: "RCOL" });
  if (amount && Number(amount) > 0) params.set("amount", amount);
  return {
    text: amount && Number(amount) > 0
      ? `Cobra ${amount} RCOL en RCOL Hub\n${walletState.address}`
      : `Cobra RCOL en RCOL Hub\n${walletState.address}`,
    link: `https://rcol-hub.vercel.app/#swap?${params.toString()}`,
    address: walletState.address,
    qrValue: amount && Number(amount) > 0
      ? `https://rcol-hub.vercel.app/#swap?${params.toString()}`
      : walletState.address
  };
}

async function renderQrDataUrl(value) {
  try {
    const mod = await import("https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm");
    const QRCode = mod.default || mod;
    return await QRCode.toDataURL(value, {
      width: 220,
      margin: 2,
      color: { dark: "#0b1220", light: "#ffffff" }
    });
  } catch {
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(value)}`;
  }
}

async function refreshReceiveQr() {
  const img = document.querySelector("#receiveQrImg");
  const empty = document.querySelector("#receiveQrEmpty");
  const addrText = document.querySelector("#receiveAddrText");
  const copyBtn = document.querySelector("#receiveCopyBtn");
  const shareBtn = document.querySelector("#receiveShareBtn");
  const payload = buildReceivePayload();

  if (!payload) {
    if (img) {
      img.hidden = true;
      img.removeAttribute("src");
    }
    if (empty) {
      empty.hidden = false;
      empty.textContent = "Conecta tu wallet para generar el QR";
    }
    if (addrText) addrText.textContent = "—";
    if (copyBtn) copyBtn.disabled = true;
    if (shareBtn) shareBtn.disabled = true;
    return;
  }

  if (empty) empty.hidden = true;
  if (addrText) {
    const amount = String(document.querySelector("#receiveAmount")?.value || "").trim();
    addrText.textContent = amount && Number(amount) > 0
      ? `${shortAddress(payload.address)} · ${amount} RCOL`
      : payload.address;
  }
  if (copyBtn) copyBtn.disabled = false;
  if (shareBtn) shareBtn.disabled = false;

  if (img) {
    img.hidden = false;
    img.src = await renderQrDataUrl(payload.qrValue);
  }
}

async function pickWorldContact() {
  if (!worldAppReady || !MiniKitApi) {
    showToast("Abre el hub en World App para usar contactos");
    return null;
  }
  if (!walletState) {
    const connected = await connectWallet();
    if (!connected) return null;
  }
  try {
    if (typeof MiniKitApi.requestPermission === "function") {
      try {
        await MiniKitApi.requestPermission({ permission: "contacts" });
      } catch {
        // Si el permiso ya esta otorgado o no aplica, seguimos a shareContacts.
      }
    }
    const res = await MiniKitApi.shareContacts({
      isMultiSelectEnabled: false,
      inviteMessage: "Enviame RCOL en RCOL Hub"
    });
    const data = res?.data || res;
    const contacts = data?.contacts || [];
    const contact = contacts[0];
    const walletAddress = contact?.walletAddress || contact?.address;
    if (!walletAddress || !isValidAddress(walletAddress)) {
      showToast("No se selecciono un contacto con wallet");
      return null;
    }
    return {
      username: contact.username || contact.name || "",
      walletAddress
    };
  } catch (error) {
    const code = String(error?.code || error?.error_code || error?.message || "");
    if (/reject|cancel|denied/i.test(code)) showToast("Contactos cancelado");
    else showToast(`Contactos: ${code || "no disponible"}`, 4000);
    return null;
  }
}

function setupSendRcol() {
  const toInput = document.querySelector("#sendTo");
  const amountInput = document.querySelector("#sendAmount");
  const ctaButton = document.querySelector("#sendCta");
  const maxButton = document.querySelector("#sendMax");
  if (!toInput || !amountInput || !ctaButton) return;

  const ctaLabel = ctaButton.querySelector("span");
  const setCta = (text, disabled) => {
    if (ctaLabel) ctaLabel.textContent = text;
    ctaButton.disabled = disabled;
    ctaButton.classList.toggle("is-busy", disabled);
  };

  const syncCtaLabel = () => {
    if (ctaButton.classList.contains("is-busy")) return;
    setCta(walletState ? "Enviar RCOL" : "Conecta tu wallet", false);
  };

  maxButton?.addEventListener("click", () => {
    if (!walletState || !(Number(sendBalanceStr) > 0)) return;
    amountInput.value = sendBalanceStr;
  });

  toInput.addEventListener("input", () => {
    if (selectedSendContact && toInput.value.trim().toLowerCase() !== selectedSendContact.walletAddress.toLowerCase()) {
      setSelectedSendContact(null);
    }
  });

  document.querySelector("#sendContactClear")?.addEventListener("click", () => {
    setSelectedSendContact(null);
    toInput.value = "";
    toInput.focus();
  });

  document.querySelector("#sendPickContact")?.addEventListener("click", async () => {
    const contact = await pickWorldContact();
    if (!contact) return;
    setSelectedSendContact(contact);
    setPayPane("send");
    showToast(contact.username ? `Contacto @${contact.username}` : "Contacto seleccionado");
  });

  document.querySelector("#payActSend")?.addEventListener("click", () => setPayPane("send"));
  document.querySelector("#payActReceive")?.addEventListener("click", () => {
    setPayPane("receive");
    if (!walletState) connectWallet().then((ok) => { if (ok) refreshReceiveQr(); });
  });
  document.querySelector("#payActContacts")?.addEventListener("click", async () => {
    const contact = await pickWorldContact();
    if (!contact) return;
    setSelectedSendContact(contact);
    setPayPane("send");
    showToast(contact.username ? `Contacto @${contact.username}` : "Contacto listo para enviar");
  });

  document.querySelector("#receiveAmount")?.addEventListener("input", () => {
    refreshReceiveQr();
  });

  document.querySelector("#receiveCopyBtn")?.addEventListener("click", async () => {
    const payload = buildReceivePayload();
    if (!payload) return;
    try {
      await navigator.clipboard.writeText(payload.qrValue);
      showToast("Cobro copiado");
    } catch {
      showToast(payload.address);
    }
  });

  document.querySelector("#receiveShareBtn")?.addEventListener("click", async () => {
    const payload = buildReceivePayload();
    if (!payload) return;
    try {
      if (MiniKitApi?.share) {
        await MiniKitApi.share({ title: "Cobrar RCOL", text: payload.text, url: payload.link });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: "Cobrar RCOL", text: payload.text, url: payload.link });
        return;
      }
      await navigator.clipboard.writeText(payload.link);
      showToast("Link de cobro copiado");
    } catch (error) {
      if (error?.name !== "AbortError") showToast("No se pudo compartir ahora");
    }
  });

  ctaButton.addEventListener("click", async () => {
    if (!worldAppReady || !MiniKitApi) {
      showToast("Abre el hub en World App para enviar RCOL");
      return;
    }

    if (!walletState) {
      const connected = await connectWallet();
      if (!connected) return;
      syncCtaLabel();
      await updateSendBalance();
    }

    const to = String(toInput.value || "").trim();
    if (!isValidAddress(to)) {
      showToast("Ingresa una direccion valida o elige un contacto");
      toInput.focus();
      return;
    }
    if (to.toLowerCase() === walletState.address.toLowerCase()) {
      showToast("No puedes enviarte a ti mismo");
      return;
    }

    const amount = parseFloat(amountInput.value);
    if (!(amount > 0)) {
      showToast("Ingresa una cantidad para enviar");
      amountInput.focus();
      return;
    }

    const amountWei = toBaseUnits(amountInput.value, RCOL_DECIMALS);
    if (amountWei <= 0n) {
      showToast("Cantidad invalida");
      return;
    }

    try {
      setCta("Confirma en tu wallet...", true);
      const result = await sendRcolTransfer(to, amountWei);
      console.log("RCOL send result:", result);
      const txHash =
        result?.data?.userOpHash ||
        result?.userOpHash ||
        result?.transaction_id ||
        result?.transactionId ||
        result?.hash ||
        null;
      saveSendToHistory(amountInput.value, to, txHash, selectedSendContact?.username || "");
      showToast(`Envio enviado: ${amountInput.value} RCOL`);
      amountInput.value = "";
      renderTxHistory();
      setTimeout(() => {
        updateSendBalance();
        updateSwapBalance();
        if (typeof fetchAllBalances === "function") fetchAllBalances();
        renderTxHistory();
      }, 12000);
    } catch (error) {
      console.error("Send RCOL error:", error);
      const message = minikitTxErrorMessage(error, "Envio fallo");
      if (message === "Cancelado") showToast("Envio cancelado");
      else showToast(message, 4500);
    } finally {
      syncCtaLabel();
    }
  });

  setPayPane("send");
  syncCtaLabel();
  updateSendBalance();
  refreshReceiveQr();
}

function saveSendToHistory(amount, to, txHash, username) {
  try {
    let history = loadTxHistory();
    history.unshift({
      type: "send",
      amount: Number(amount),
      to,
      username: username || "",
      hash: txHash,
      time: Date.now()
    });
    if (history.length > TX_HISTORY_MAX) history = history.slice(0, TX_HISTORY_MAX);
    localStorage.setItem(TX_HISTORY_KEY, JSON.stringify(history));
  } catch {}
}

const BURN_TO = BURN_ADDRESSES[0];
let burnBalanceStr = "0";

async function updateBurnBalance() {
  const maxButton = document.querySelector("#burnMax");
  const valEl = document.querySelector("#burnBalanceVal");
  if (!maxButton || !valEl) return;
  if (!walletState) {
    maxButton.hidden = true;
    return;
  }
  maxButton.hidden = false;
  try {
    const raw = await getTokenBalanceRaw(RCOL_ADDRESS, walletState.address);
    burnBalanceStr = fromBaseUnits(raw, RCOL_DECIMALS);
    valEl.textContent = formatTokenAmount(Number(burnBalanceStr));
  } catch {
    valEl.textContent = "—";
  }
}

function setupBurnRcol() {
  const amountInput = document.querySelector("#burnAmount");
  const ctaButton = document.querySelector("#burnCta");
  const maxButton = document.querySelector("#burnMax");
  if (!amountInput || !ctaButton) return;

  const ctaLabel = ctaButton.querySelector("span");
  const setCta = (text, disabled) => {
    if (ctaLabel) ctaLabel.textContent = text;
    ctaButton.disabled = disabled;
    ctaButton.classList.toggle("is-busy", disabled);
  };

  const syncCtaLabel = () => {
    if (ctaButton.classList.contains("is-busy")) return;
    setCta(walletState ? "Quemar RCOL" : "Conecta tu wallet", false);
  };

  maxButton?.addEventListener("click", () => {
    if (!walletState || !(Number(burnBalanceStr) > 0)) return;
    // Deja ~3% de margen por el impuesto ~2% y redondeo.
    const raw = toBaseUnits(burnBalanceStr, RCOL_DECIMALS);
    const safe = (raw * 97n) / 100n;
    amountInput.value = fromBaseUnits(safe, RCOL_DECIMALS);
  });

  ctaButton.addEventListener("click", async () => {
    if (!worldAppReady || !MiniKitApi) {
      showToast("Abre el hub en World App para quemar RCOL");
      return;
    }

    if (!walletState) {
      const connected = await connectWallet();
      if (!connected) return;
      syncCtaLabel();
      await updateBurnBalance();
    }

    const amount = parseFloat(amountInput.value);
    if (!(amount > 0)) {
      showToast("Ingresa una cantidad para quemar");
      amountInput.focus();
      return;
    }

    const amountWei = toBaseUnits(amountInput.value, RCOL_DECIMALS);
    if (amountWei <= 0n) {
      showToast("Cantidad invalida");
      return;
    }

    const ok = window.confirm(
      `Vas a quemar ${amountInput.value} RCOL de forma irreversible.\n\nSe envian a la direccion dead y salen de circulacion. Continuar?`
    );
    if (!ok) return;

    try {
      setCta("Confirmando quema...", true);
      const result = await burnRcolViaPermit2(amountWei);
      console.log("RCOL burn result:", result);
      const burnedAmount = Number(amountInput.value);
      const txHash =
        result?.data?.userOpHash ||
        result?.userOpHash ||
        result?.transaction_id ||
        result?.transactionId ||
        result?.hash ||
        null;
      saveBurnToHistory(burnedAmount, txHash);
      showToast(`Quema enviada: ${amountInput.value} RCOL`);
      amountInput.value = "";
      renderTxHistory();
      setTimeout(() => {
        updateBurnBalance();
        updateSendBalance();
        updateSwapBalance();
        if (typeof fetchAllBalances === "function") fetchAllBalances();
        if (typeof fetchBurned === "function") fetchBurned();
        renderTxHistory();
      }, 12000);
    } catch (error) {
      console.error("Burn RCOL error:", error);
      const message = minikitTxErrorMessage(error, "Quema fallo");
      if (message === "Cancelado") showToast("Quema cancelada");
      else showToast(message, 5000);
    } finally {
      syncCtaLabel();
    }
  });

  syncCtaLabel();
  updateBurnBalance();
}

function scheduleQuote() {
  clearTimeout(quoteTimer);
  quoteTimer = setTimeout(runQuote, 350);
}

async function runQuote() {
  const fromSelect = document.querySelector("#swapFrom");
  const toSelect = document.querySelector("#swapTo");
  const amountInput = document.querySelector("#swapAmount");
  if (!fromSelect || !toSelect || !amountInput) return;

  const fromSym = fromSelect.value;
  const toSym = toSelect.value;
  const fromToken = tokenBySymbol[fromSym];
  const toToken = tokenBySymbol[toSym];
  const amount = parseFloat(amountInput.value) || 0;

  if (!(amount > 0)) {
    lastQuote = null;
    renderQuote(null);
    return;
  }

  const seq = ++quoteSeq;
  renderQuote({ loading: true });

  try {
    const path = buildPath(fromSym, toSym);
    const amountInWei = toBaseUnits(amountInput.value, fromToken.decimals);
    const amountOut = await quoteAmountOut(amountInWei, path);
    if (seq !== quoteSeq) return; // llego una cotizacion mas nueva

    if (!amountOut || amountOut === 0n) {
      lastQuote = null;
      renderQuote({ empty: true });
      return;
    }

    const outNum = Number(fromBaseUnits(amountOut, toToken.decimals));
    const usd = tokenPrices[toSym] ? outNum * tokenPrices[toSym] : null;
    lastQuote = { fromSym, toSym, amountInWei, amountOut, path };
    renderQuote({ outNum, usd, fromSym, amount });
  } catch (error) {
    if (seq !== quoteSeq) return;
    console.error("Quote error:", error);
    lastQuote = null;
    renderQuote({ error: true });
  }
}

function renderQuote(state) {
  const output = document.querySelector("#swapOut");
  const fromUsd = document.querySelector("#swapFromUsd");
  const toUsd = document.querySelector("#swapToUsd");
  if (!output) return;

  if (!state) {
    output.textContent = "0.0";
    fromUsd.innerHTML = "&nbsp;";
    toUsd.innerHTML = "&nbsp;";
    return;
  }
  if (state.loading) {
    toUsd.textContent = "Calculando precio on-chain...";
    return;
  }
  if (state.empty) {
    output.textContent = "â";
    toUsd.textContent = "Sin liquidez para esta ruta";
    return;
  }
  if (state.error) {
    output.textContent = "â";
    toUsd.textContent = "No se pudo cotizar, reintenta";
    return;
  }

  output.textContent = formatTokenAmount(state.outNum);
  const fromUsdValue = tokenPrices[state.fromSym] ? state.amount * tokenPrices[state.fromSym] : null;
  fromUsd.textContent = fromUsdValue ? `≈ $${formatPrice(fromUsdValue)}` : " ";
  toUsd.textContent = state.usd ? `≈ $${formatPrice(state.usd)} · on-chain` : "Precio on-chain Uniswap";
  // Actualizar pill de precio con la cotizacion on-chain (WLD→RCOL es la mas precisa).
  if (state.amount > 0 && state.fromSym === "WLD" && state.toSym === "RCOL") {
    const rate = state.outNum / state.amount;
    const rateLabel = `1 WLD ≈ ${formatTokenAmount(rate)} RCOL`;
    setSwapRate(rateLabel, `≈ ${abbreviate(rate)} RCOL/WLD`);
    const teaserEl = document.querySelector("#swapTeaserRate");
    if (teaserEl) teaserEl.textContent = rateLabel;
  }
}

/* ---------- Historial de swaps ---------- */

const TX_HISTORY_KEY = "rcol-tx-history";
const TX_HISTORY_MAX = 20;

// Guarda el swap recien firmado en localStorage para pintarlo al instante.
// El historial completo se reconstruye luego desde la blockchain (fetchOnchainSwaps).
function saveTxToHistory(fromSym, toSym, amountIn, amountOut, txHash) {
  try {
    let history = loadTxHistory();
    history.unshift({ type: "swap", fromSym, toSym, amountIn, amountOut, hash: txHash, time: Date.now() });
    if (history.length > TX_HISTORY_MAX) history = history.slice(0, TX_HISTORY_MAX);
    localStorage.setItem(TX_HISTORY_KEY, JSON.stringify(history));
  } catch {}
}

function saveBurnToHistory(amount, txHash) {
  try {
    let history = loadTxHistory();
    history.unshift({ type: "burn", amount, hash: txHash, time: Date.now() });
    if (history.length > TX_HISTORY_MAX) history = history.slice(0, TX_HISTORY_MAX);
    localStorage.setItem(TX_HISTORY_KEY, JSON.stringify(history));
  } catch {}
}

function loadTxHistory() {
  try {
    const raw = localStorage.getItem(TX_HISTORY_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function formatRelativeTime(timestamp) {
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `hace ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `hace ${diffD}d`;
}

const EXPLORER_API = "https://worldchain-mainnet.explorer.alchemy.com/api/v2";
const BURN_ADDR_SET = new Set(BURN_ADDRESSES.map((a) => a.toLowerCase()));

// Lee transfers REALES de RCOL desde la blockchain (swaps + quemas a dead).
async function fetchOnchainSwaps(address) {
  const url = `${EXPLORER_API}/addresses/${address}/token-transfers?type=ERC-20&token=${RCOL_ADDRESS}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const items = Array.isArray(data.items) ? data.items : [];
  const me = address.toLowerCase();
  const seen = new Set();
  const swaps = [];
  for (const it of items) {
    const hash = it.transaction_hash;
    const from = it.from?.hash?.toLowerCase();
    const to = it.to?.hash?.toLowerCase();
    if (!hash || seen.has(hash)) continue;
    const dec = Number(it.total?.decimals ?? 18);
    const amount = it.total?.value != null ? Number(fromBaseUnits(BigInt(it.total.value), dec)) : null;
    const time = it.timestamp ? Date.parse(it.timestamp) : null;

    if (from === me && to && BURN_ADDR_SET.has(to)) {
      seen.add(hash);
      swaps.push({ type: "burn", rcolAmount: amount, hash, time });
      continue;
    }

    let buy;
    if (to === me) buy = true;
    else if (from === me) buy = false;
    else continue;
    seen.add(hash);
    swaps.push({ type: "swap", buy, rcolAmount: amount, hash, time });
  }
  return swaps;
}

// Normaliza una entrada de localStorage (sabe ambos lados del par) a item de UI.
function localTxToItem(tx) {
  if (tx.type === "burn") {
    return {
      type: "burn",
      hash: tx.hash,
      time: tx.time,
      amount: tx.amount,
      rcolAmount: tx.amount,
      rcolOnly: false
    };
  }
  if (tx.type === "send") {
    return {
      type: "send",
      hash: tx.hash,
      time: tx.time,
      amount: tx.amount,
      to: tx.to,
      username: tx.username || "",
      rcolOnly: false
    };
  }
  return {
    type: "swap",
    buy: tx.toSym === "RCOL",
    hash: tx.hash,
    time: tx.time,
    fromSym: tx.fromSym,
    toSym: tx.toSym,
    amountIn: tx.amountIn,
    amountOut: tx.amountOut,
    rcolOnly: false
  };
}

function txItemHtml(item) {
  const isBurn = item.type === "burn";
  const isSend = item.type === "send";
  const buy = !isBurn && !isSend && item.buy;
  const explorerHref = item.hash
    ? `https://worldchain-mainnet.explorer.alchemy.com/tx/${item.hash}`
    : null;
  const timeLabel = item.time ? formatRelativeTime(item.time) : "";

  let pairHtml;
  let badge;
  let icon;
  let rowClass;

  if (isBurn) {
    const amt =
      item.amount != null
        ? formatTokenAmount(Number(item.amount))
        : item.rcolAmount != null
          ? formatTokenAmount(Number(item.rcolAmount))
          : "?";
    pairHtml = `<strong>−${escapeHtml(amt)} RCOL</strong>`;
    badge = "Quema";
    icon = "trash-2";
    rowClass = "tx-item--burn";
  } else if (isSend) {
    const amt = item.amount != null ? formatTokenAmount(Number(item.amount)) : "?";
    const dest = item.username
      ? `@${item.username}`
      : item.to
        ? shortAddress(item.to)
        : "destino";
    pairHtml = `<strong>−${escapeHtml(amt)} RCOL</strong><span class="tx-item__sub">A ${escapeHtml(dest)}</span>`;
    badge = "Enviado";
    icon = "send";
    rowClass = "tx-item--send";
  } else if (item.rcolOnly) {
    const amt = item.rcolAmount != null ? formatTokenAmount(Number(item.rcolAmount)) : "?";
    pairHtml = `<strong>${buy ? "+" : "−"}${escapeHtml(amt)} RCOL</strong>`;
    badge = buy ? "Compra" : "Venta";
    icon = buy ? "arrow-down-left" : "arrow-up-right";
    rowClass = buy ? "tx-item--buy" : "tx-item--sell";
  } else {
    const aIn = item.amountIn != null ? formatTokenAmount(Number(item.amountIn)) : "?";
    const aOut = item.amountOut != null ? formatTokenAmount(Number(item.amountOut)) : "?";
    pairHtml = `<strong>${escapeHtml(aIn)} ${escapeHtml(item.fromSym || "?")}</strong>
      <i data-lucide="arrow-right" class="tx-item__arrow" aria-hidden="true"></i>
      <strong>${escapeHtml(aOut)} ${escapeHtml(item.toSym || "?")}</strong>`;
    badge = buy ? "Compra" : "Venta";
    icon = buy ? "arrow-down-left" : "arrow-up-right";
    rowClass = buy ? "tx-item--buy" : "tx-item--sell";
  }

  const badgeClass = isBurn
    ? "tx-item__badge--burn"
    : isSend
      ? "tx-item__badge--send"
      : buy
        ? "tx-item__badge--buy"
        : "tx-item__badge--sell";

  return `
    <div class="tx-item ${rowClass}">
      <span class="tx-item__icon">
        <i data-lucide="${icon}" aria-hidden="true"></i>
      </span>
      <span class="tx-item__body">
        <span class="tx-item__pair">${pairHtml}</span>
        <span class="tx-item__meta">
          <span class="tx-item__time">${escapeHtml(timeLabel)}</span>
          <span class="tx-item__badge ${badgeClass}">${badge}</span>
        </span>
      </span>
      ${explorerHref
        ? `<a class="tx-item__link" href="${encodeURI(explorerHref)}" target="_blank" rel="noreferrer" aria-label="Ver en explorador">
            <i data-lucide="external-link" aria-hidden="true"></i>
          </a>`
        : `<span class="tx-item__link tx-item__link--none">
            <i data-lucide="check-circle" aria-hidden="true"></i>
          </span>`
      }
    </div>`;
}

function paintTxList(items) {
  const section = document.querySelector("#txHistory");
  const list = document.querySelector("#txHistoryList");
  if (!section || !list) return;
  if (!items.length) { section.hidden = true; return; }
  section.hidden = false;
  list.innerHTML = items.slice(0, TX_HISTORY_MAX).map(txItemHtml).join("");
  window.lucide?.createIcons?.();
}

function renderTxHistory() {
  // 1) Pintar de inmediato lo que haya en localStorage (respuesta instantánea).
  const local = loadTxHistory();
  const localItems = local.map(localTxToItem).sort((a, b) => (b.time || 0) - (a.time || 0));
  paintTxList(localItems);

  // 2) Si hay wallet, traer el historial REAL on-chain y fusionar.
  if (!walletState) return;
  const me = walletState.address;
  fetchOnchainSwaps(me)
    .then((onchain) => {
      if (!walletState || walletState.address !== me) return; // cambio la wallet
      if (!onchain.length) return; // sin datos on-chain: dejamos lo local

      const localByHash = {};
      local.forEach((tx) => {
        if (tx.hash) localByHash[tx.hash.toLowerCase()] = tx;
      });

      // On-chain es la fuente de verdad; enriquecemos con localStorage si coincide el hash.
      const merged = onchain.map((s) => {
        const l = s.hash ? localByHash[s.hash.toLowerCase()] : null;
        if (l) return localTxToItem(l);
        if (s.type === "burn") {
          return { type: "burn", hash: s.hash, time: s.time, rcolAmount: s.rcolAmount, rcolOnly: true };
        }
        return { type: "swap", buy: s.buy, hash: s.hash, time: s.time, rcolAmount: s.rcolAmount, rcolOnly: true };
      });

      // Sumar entradas locales recien hechas que el indexador aun no tiene.
      const onchainHashes = new Set(onchain.map((s) => s.hash?.toLowerCase()).filter(Boolean));
      local.forEach((tx) => {
        if (!tx.hash || !onchainHashes.has(tx.hash.toLowerCase())) merged.push(localTxToItem(tx));
      });

      merged.sort((a, b) => (b.time || 0) - (a.time || 0));
      paintTxList(merged);
    })
    .catch(() => {});
}

function updateSwapTeaser() {
  const el = document.querySelector("#swapTeaserRate");
  if (!el) return;
  if (tokenPrices.WLD > 0 && tokenPrices.RCOL > 0) {
    const rate = tokenPrices.WLD / tokenPrices.RCOL;
    el.textContent = `1 WLD ≈ ${formatTokenAmount(rate)} RCOL`;
  } else if (tokenPrices.RCOL > 0) {
    el.textContent = `1 RCOL ≈ $${formatPrice(tokenPrices.RCOL)}`;
  }
}

async function refreshSwapRate() {
  try {
    const path = buildPath("WLD", "RCOL");
    const amountIn = toBaseUnits("1", tokenBySymbol["WLD"].decimals);
    const amountOut = await quoteAmountOut(amountIn, path);
    if (!amountOut || amountOut === 0n) return;
    const outNum = Number(fromBaseUnits(amountOut, tokenBySymbol["RCOL"].decimals));
    const rateLabel = `1 WLD ≈ ${formatTokenAmount(outNum)} RCOL`;
    const shortLabel = `≈ ${abbreviate(outNum)} RCOL/WLD`;
    setSwapRate(rateLabel, shortLabel);
    const teaserEl = document.querySelector("#swapTeaserRate");
    if (teaserEl) teaserEl.textContent = rateLabel;
  } catch {}
}

// Color de marca por token para el avatar y el badge de la lista del portafolio.
const TOKEN_COLORS = {
  RCOL: "#f8d66d",
  WLD: "#ffffff",
  USDC: "#2775ca",
  WETH: "#8a92b2"
};

// Ícono del token: logo real con fallback a iniciales si la imagen no carga.
function tokenIconHtml(token) {
  const color = TOKEN_COLORS[token.symbol] || "#f8d66d";
  const init = escapeHtml(token.symbol.slice(0, 2));
  const img = token.logo
    ? `<img src="${escapeHtml(token.logo)}" alt="" loading="lazy" onerror="this.remove()" />`
    : "";
  return `<span class="wallet-token__icon" style="--tk:${color}"><span class="wallet-token__init">${init}</span>${img}</span>`;
}

async function fetchAllBalances() {
  const container = document.querySelector("#swapBalances");
  const totalEl = document.querySelector("#walletTotal");
  const totalValueEl = document.querySelector("#walletTotalValue");
  if (!container || !walletState) return;

  container.hidden = false;
  // Esqueleto de carga mientras llegan los saldos on-chain.
  container.innerHTML = SWAP_TOKENS.map(
    (token) => `
      <div class="wallet-token is-loading" data-sym="${escapeHtml(token.symbol)}">
        ${tokenIconHtml(token)}
        <span class="wallet-token__info">
          <strong>${escapeHtml(token.symbol)}</strong>
          <small>${escapeHtml(token.name)}</small>
        </span>
        <span class="wallet-token__amounts">
          <span class="wallet-token__bal">...</span>
          <span class="wallet-token__usd"></span>
        </span>
      </div>`
  ).join("");
  window.lucide?.createIcons?.();

  const results = await Promise.allSettled(
    SWAP_TOKENS.map((token) => getTokenBalanceRaw(token.address, walletState.address))
  );

  const rows = results.map((result, i) => {
    const token = SWAP_TOKENS[i];
    const amount = result.status === "fulfilled" ? Number(fromBaseUnits(result.value, token.decimals)) : 0;
    const price = tokenPrices[token.symbol] || 0;
    const usd = amount * price;
    return { token, amount, usd, ok: result.status === "fulfilled" };
  });

  const total = rows.reduce((sum, row) => sum + row.usd, 0);

  // Orden: tokens con saldo primero (por valor USD desc), luego los vacíos.
  rows.sort((a, b) => {
    if ((a.amount > 0) !== (b.amount > 0)) return a.amount > 0 ? -1 : 1;
    return b.usd - a.usd;
  });

  container.innerHTML = rows
    .map(({ token, amount, usd, ok }) => {
      const balText = !ok ? "—" : formatTokenAmount(amount);
      const usdText = usd > 0 ? `$${formatPrice(usd)}` : "—";
      const dim = amount > 0 ? "" : " is-empty";
      return `
        <div class="wallet-token${dim}" data-sym="${escapeHtml(token.symbol)}">
          ${tokenIconHtml(token)}
          <span class="wallet-token__info">
            <strong>${escapeHtml(token.symbol)}</strong>
            <small>${escapeHtml(token.name)}</small>
          </span>
          <span class="wallet-token__amounts">
            <span class="wallet-token__bal">${escapeHtml(balText)}</span>
            <span class="wallet-token__usd">${escapeHtml(usdText)}</span>
          </span>
        </div>`;
    })
    .join("");
  window.lucide?.createIcons?.();

  if (totalEl && totalValueEl) {
    totalEl.hidden = false;
    totalValueEl.textContent = `$${formatPrice(total)}`;
  }
}

function setSwapRate(rateText, shortText) {
  const pill = document.querySelector("#swapPricePill");
  const row = document.querySelector("#swapRate");
  const rowText = document.querySelector("#swapRateText");
  if (pill && rateText) pill.textContent = shortText || rateText;
  if (row && rowText && rateText) {
    rowText.textContent = `${rateText} · Uniswap v2`;
    row.dataset.hasRate = "1";
    const sendMode = !document.querySelector("#section-send")?.hidden;
    const burnMode = !document.querySelector("#section-burn")?.hidden;
    row.hidden = Boolean(sendMode || burnMode);
  }
}

function renderSwapView() {
  // Precio / tasa usando precios DexScreener o RCOL price como fallback
  if (tokenPrices.WLD > 0 && tokenPrices.RCOL > 0) {
    const rate = tokenPrices.WLD / tokenPrices.RCOL;
    setSwapRate(`1 WLD ≈ ${formatTokenAmount(rate)} RCOL`, `≈ ${abbreviate(rate)} RCOL/WLD`);
  } else if (tokenPrices.RCOL > 0) {
    setSwapRate(`1 RCOL ≈ $${formatPrice(tokenPrices.RCOL)}`, `$${formatPrice(tokenPrices.RCOL)}`);
  }

  renderWalletCard();
  renderTxHistory();
  refreshSwapRate();
  scheduleQuote();
  updateSendBalance();
  updateBurnBalance();
  const sendCta = document.querySelector("#sendCta span");
  if (sendCta) sendCta.textContent = walletState ? "Enviar RCOL" : "Conecta tu wallet";
  const burnCta = document.querySelector("#burnCta span");
  if (burnCta) burnCta.textContent = walletState ? "Quemar RCOL" : "Conecta tu wallet";
}

// Fallback visual si World no entrega foto de perfil.
function avatarGradient(address) {
  const hex = (address || "0x00").slice(2);
  const h1 = parseInt(hex.slice(0, 6) || "0", 16) % 360;
  const h2 = (h1 + 60 + (parseInt(hex.slice(6, 10) || "0", 16) % 120)) % 360;
  return `linear-gradient(135deg, hsl(${h1} 70% 55%), hsl(${h2} 80% 45%))`;
}

function setWalletAvatar(address, profilePictureUrl) {
  const avatarEl = document.querySelector("#walletAvatar");
  const imgEl = document.querySelector("#walletAvatarImg");
  if (!avatarEl) return;

  if (profilePictureUrl && imgEl) {
    imgEl.hidden = false;
    imgEl.src = profilePictureUrl;
    imgEl.onerror = () => {
      imgEl.hidden = true;
      imgEl.removeAttribute("src");
      avatarEl.style.background = avatarGradient(address);
    };
    avatarEl.style.background = "transparent";
    return;
  }

  if (imgEl) {
    imgEl.hidden = true;
    imgEl.removeAttribute("src");
  }
  avatarEl.style.background = address ? avatarGradient(address) : "";
}

function renderWalletCard() {
  const nameEl = document.querySelector("#swapWalletLabel");
  const connectBtn = document.querySelector("#swapConnectBtn");
  const refreshBtn = document.querySelector("#walletRefresh");
  const historyBtn = document.querySelector("#walletHistory");
  const balancesEl = document.querySelector("#swapBalances");
  const totalEl = document.querySelector("#walletTotal");
  const emptyEl = document.querySelector("#walletEmpty");
  const avatarEl = document.querySelector("#walletAvatar");
  const addrBtn = document.querySelector("#walletAddrCopy");
  const addrText = document.querySelector("#walletAddrText");

  if (walletState) {
    if (nameEl) nameEl.textContent = walletState.username ? `@${walletState.username}` : "Mi portafolio";
    if (connectBtn) connectBtn.hidden = true;
    if (refreshBtn) refreshBtn.hidden = false;
    if (historyBtn) historyBtn.hidden = false;
    if (emptyEl) emptyEl.hidden = true;
    setWalletAvatar(walletState.address, walletState.profilePictureUrl);
    if (avatarEl && (walletState.username || walletState.address)) {
      avatarEl.style.cursor = "pointer";
      avatarEl.title = "Ver perfil World";
      avatarEl.onclick = () => {
        try {
          MiniKitApi?.showProfileCard?.(walletState.username || undefined, walletState.address);
        } catch {}
      };
    }
    if (addrBtn && addrText) {
      addrBtn.hidden = false;
      addrText.textContent = shortAddress(walletState.address);
    }
    fetchAllBalances();
  } else {
    if (nameEl) nameEl.textContent = "Tu portafolio RCOL";
    if (connectBtn) connectBtn.hidden = false;
    if (refreshBtn) refreshBtn.hidden = true;
    if (historyBtn) historyBtn.hidden = true;
    if (emptyEl) emptyEl.hidden = false;
    if (totalEl) totalEl.hidden = true;
    setWalletAvatar(null, null);
    if (avatarEl) {
      avatarEl.style.cursor = "";
      avatarEl.title = "";
      avatarEl.onclick = null;
    }
    if (addrBtn) addrBtn.hidden = true;
    if (balancesEl) { balancesEl.innerHTML = ""; balancesEl.hidden = true; }
  }
  window.lucide?.createIcons?.();
}

/* ---------- Vistas (hub / nft / swap) ---------- */

function setupViews() {
  const hero = document.querySelector(".hero");
  const hub = document.querySelector("#hubView");
  const nftView = document.querySelector("#nftView");
  const swapView = document.querySelector("#swapView");
  const navLinks = Array.from(document.querySelectorAll(".bottom-nav a"));
  if (!hub || !nftView) return;

  const showView = (name) => {
    const isNft = name === "nft";
    const isSwap = name === "swap";
    const isHub = !isNft && !isSwap;
    if (hero) hero.hidden = !isHub;
    hub.hidden = !isHub;
    nftView.hidden = !isNft;
    if (swapView) swapView.hidden = !isSwap;
    navLinks.forEach((a) => {
      const href = a.getAttribute("href");
      a.classList.toggle(
        "is-active",
        isNft ? href === "#nft" : isSwap ? href === "#swap" : href === "#appTitle"
      );
    });
    window.scrollTo({ top: 0 });
    window.lucide?.createIcons?.();
    if (isSwap) renderSwapView();
  };

  const applyPayDeepLink = () => {
    const raw = location.hash || "";
    if (!raw.startsWith("#swap")) return;
    const query = raw.includes("?") ? raw.slice(raw.indexOf("?") + 1) : "";
    if (!query) return;
    const params = new URLSearchParams(query);
    const to = String(params.get("to") || "").trim();
    const amount = String(params.get("amount") || "").trim();
    if (!isValidAddress(to) && !(amount && Number(amount) > 0)) return;
    setWalletMode("send");
    setPayPane("send");
    if (isValidAddress(to)) {
      const toInput = document.querySelector("#sendTo");
      if (toInput) toInput.value = to;
      setSelectedSendContact(null);
    }
    if (amount && Number(amount) > 0) {
      const amountInput = document.querySelector("#sendAmount");
      if (amountInput) amountInput.value = amount;
    }
    showToast("Cobro cargado: revisa destino y cantidad");
  };

  const route = () => {
    const hash = location.hash || "";
    if (hash === "#nft" || hash.startsWith("#nft?")) showView("nft");
    else if (hash === "#swap" || hash.startsWith("#swap?")) {
      showView("swap");
      applyPayDeepLink();
    } else showView("hub");
  };

  window.addEventListener("hashchange", route);

  navLinks.forEach((a) => {
    const href = a.getAttribute("href");
    if (href === "#nft" || href === "#swap") return;
    a.addEventListener("click", (event) => {
      event.preventDefault();
      if (location.hash === "#nft" || location.hash === "#swap") {
        history.replaceState(null, "", location.pathname + location.search);
      }
      showView("hub");
      const target = document.querySelector(href);
      if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
    });
  });

  document.querySelector("#nftBack")?.addEventListener("click", () => {
    history.replaceState(null, "", location.pathname + location.search);
    showView("hub");
  });

  document.querySelector("#swapBack")?.addEventListener("click", () => {
    history.replaceState(null, "", location.pathname + location.search);
    showView("hub");
  });

  setupScrollSpy(navLinks, nftView, swapView);
  route();
}

// Microanimaciones de entrada de las tarjetas del hub al hacer scroll.
function setupReveal() {
  const hub = document.querySelector("#hubView");
  if (!hub) return;
  const items = Array.from(hub.children);
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  items.forEach((el) => el.classList.add("reveal"));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
  );
  items.forEach((el) => observer.observe(el));
  // Failsafe: si algo no dispara, mostrar todo.
  setTimeout(() => items.forEach((el) => el.classList.add("is-visible")), 1400);
}

// Resalta en el nav la seccion del hub que esta en pantalla.
function setupScrollSpy(navLinks, nftView, swapView) {
  if (!("IntersectionObserver" in window)) return;
  const map = [
    [".hero", "#appTitle"],
    ["#section-market", "#section-market"],
    [".link-section", "#linksTitle"],
    ["#section-community", "#section-community"]
  ];
  const targets = map
    .map(([selector, href]) => ({ el: document.querySelector(selector), href }))
    .filter((target) => target.el);
  if (!targets.length) return;

  const setActive = (href) => {
    if (!nftView.hidden || (swapView && !swapView.hidden)) return;
    navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === href));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = targets.find((t) => t.el === entry.target);
        if (target) setActive(target.href);
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  targets.forEach((target) => observer.observe(target.el));
}

/* ---------- Boot ---------- */

async function boot() {
  setupTheme();
  setupSwap();
  setupWallet();
  setupViews();
  setupNftModal();
  setupReveal();
  setupWorldId();
  loadMarketData();

  const config = await loadConfig();
  applyConfig(config);
  const appId = config.worldIdAppId || fallbackConfig.worldIdAppId;
  const installResult = await loadMiniKit(appId);
  updateWorldStatus(installResult);
  await maybeShowWorldIdModal();

  document.querySelector("#copyToken").addEventListener("click", () => copyToken(config));
  document.querySelector("#shareButton").addEventListener("click", () => shareApp(config));
}

boot();
