const CONFIG_URL = "./config.json";

const RCOL_ADDRESS = "0x82bF7aA0680D9C2D6fFa77b995e2092fE68d308a";
const RCOL_DECIMALS = 18;
const WORLDCHAIN_RPC = "https://worldchain-mainnet.g.alchemy.com/public";
const EXPLORER_TOKEN_API = "https://worldchain-mainnet.explorer.alchemy.com/api/v2/tokens/";
const DEXSCREENER_TOKENS_API = "https://api.dexscreener.com/tokens/v1/worldchain/";
const PUF_APP_ID = "app_e5ba7c3061400e361f98ce44d8b1b9c4";
const BURN_ADDRESSES = [
  "0x000000000000000000000000000000000000dEaD",
  "0x0000000000000000000000000000000000000000"
];

const WLD_ADDRESS = "0x2cFc85d8E48F8EAB294be644d9E25C3030863003";
const RCOL_POOL = "0xe5f1c6b95cf182b09807b73f21f622fae08dd439"; // pool Uniswap v2 RCOL/WLD
const GECKO_OHLCV_API = `https://api.geckoterminal.com/api/v2/networks/world-chain/pools/${RCOL_POOL}/ohlcv/hour?aggregate=1&limit=24`;

const SWAP_TOKENS = [
  { symbol: "RCOL", name: "RCOL", address: RCOL_ADDRESS, decimals: 18 },
  { symbol: "WLD", name: "Worldcoin", address: WLD_ADDRESS, decimals: 18 },
  { symbol: "USDC", name: "USD Coin", address: "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1", decimals: 6 },
  { symbol: "WETH", name: "Ethereum", address: "0x4200000000000000000000000000000000000006", decimals: 18 }
];

// RCOL solo tiene liquidez contra WLD (pool Uniswap v2 en Worldchain).
// Cualquier otro token se enruta a traves de WLD.
const UNISWAP_V2_ROUTER = "0x541aB7c31A119441eF3575F6973277DE0eF460bd"; // solo para cotizar (getAmountsOut)
// El swap se ejecuta via Permit2 + Universal Router: World App no permite el
// approve de ERC20 directo (error disallowed_operation), pero si Permit2.
const UNIVERSAL_ROUTER = "0x8ac7bee993bb44dab564ea4bc9ea67bf9eb5e743";
const PERMIT2 = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
const V2_SWAP_EXACT_IN = "0x08"; // comando del Universal Router
const UR_MSG_SENDER = "0x0000000000000000000000000000000000000001"; // constante: el destinatario es quien firma
// RCOL cobra ~2% de impuesto en cada transferencia (token fee-on-transfer),
// que getAmountsOut no refleja. El slippage debe cubrir ese impuesto + movimiento.
const SWAP_SLIPPAGE_BPS = 400n; // 4.0%
const SWAP_DEADLINE_MIN = 20;

const fallbackConfig = {
  brand: "RCOL Hub",
  headline: "Bienvenido al Hub Oficial de RCOLombia DAO",
  tagline: "Solo humanos verificados. Nuestra identidad, nuestro respaldo.",
  tokenAddress: RCOL_ADDRESS,
  worldIdAppId: "app_a95edab5dd0638c6f02dcf3ff407694c",
  worldIdRpId: "rp_013fbbe37584c9e5",
  worldIdAction: "",
  links: [
    {
      id: "website",
      title: "Sitio Web Oficial",
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
      id: "game",
      title: "Vuela RCOL",
      description: "En World App",
      url: "https://world.org/mini-app?app_id=app_a5901e6e8ce50db069d46bfb3c9b0fa3&path=&draft_id=meta_97372caabf92d72fac6d1f051da854c0",
      icon: "./assets/vuela-rcol.png",
      isImage: true,
      accent: "#facc15"
    },
    {
      id: "puf",
      title: "Token RCOL en PUF",
      description: "Ver token y mercado",
      url: "https://world.org/mini-app?app_id=app_e5ba7c3061400e361f98ce44d8b1b9c4&path=/token/0x82bf7aa0680d9c2d6ffa77b995e2092fe68d308a",
      icon: "link",
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
      icon: "x"
    },
    {
      title: "Telegram",
      handle: "t.me/updatesDzc",
      url: "https://t.me/updatesDzc",
      icon: "send"
    }
  ],
  announcements: [
    {
      title: "Vuela RCOL",
      subtitle: "Juega ahora en World App",
      icon: "gamepad-2",
      accent: "#facc15",
      image: "",
      url: "https://world.org/mini-app?app_id=app_a5901e6e8ce50db069d46bfb3c9b0fa3&path=&draft_id=meta_97372caabf92d72fac6d1f051da854c0"
    },
    {
      title: "Flappy Butterfly",
      subtitle: "El nuevo juego RCOL",
      icon: "bird",
      accent: "#18e0a0",
      image: "",
      url: ""
    },
    {
      title: "Siguenos en X",
      subtitle: "@Rcol_Oficial",
      icon: "x",
      accent: "#ffffff",
      image: "",
      url: "https://x.com/Rcol_Oficial"
    }
  ],
  nft: {
    title: "RCOL Protocol Genesis",
    tagline: "NFT de utilidad",
    description:
      "Coleccion de 100 NFT unicos. Cada Genesis es tu llave de holder verificado: desbloquea ventajas en los juegos RCOL, badge oficial y airdrops exclusivos. Mientras mas baja la edicion, mayores los beneficios.",
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
        description: "Badge oficial en el hub que identifica tu wallet como holder Genesis."
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

async function loadMiniKit() {
  try {
    const looksLikeWorldApp = Boolean(window.WorldApp) || /WorldApp|MiniKit/i.test(navigator.userAgent);
    if (!looksLikeWorldApp) return { success: false };

    const mod = await import("https://cdn.jsdelivr.net/npm/@worldcoin/minikit-js@2.0.3/+esm");
    MiniKitApi = mod.MiniKit;
    return MiniKitApi?.install?.();
  } catch {
    return { success: false };
  }
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

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
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

function renderLinks(links) {
  const grid = document.querySelector("#linkGrid");
  grid.innerHTML = "";

  links.forEach((link) => {
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
    element.innerHTML = `
      <i data-lucide="${escapeHtml(item.icon || "link")}" aria-hidden="true"></i>
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
  if (puf && !isPlaceholder(puf.url)) document.querySelector("#pufCta").href = puf.url;

  renderAnnouncements(config.announcements || []);
  renderLinks(config.links);
  renderCommunity(config.community || []);
  renderNft(config.nft);
  window.lucide?.createIcons?.();
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
      const hasImage = Boolean(item.image);
      const media = hasImage
        ? `<img class="ann-card__img" src="${escapeHtml(item.image)}" alt="" loading="lazy" />`
        : `<span class="ann-card__icon"><i data-lucide="${escapeHtml(item.icon || "megaphone")}" aria-hidden="true"></i></span>`;
      return `
        <${tag} class="ann-card${hasImage ? " has-image" : ""}" style="--accent:${accent}"${
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
  const status = document.querySelector("#worldStatus");
  worldAppReady = Boolean(window.WorldApp) || Boolean(installResult?.success);
  status.classList.toggle("is-ready", worldAppReady);
  status.classList.toggle("is-browser", !worldAppReady);
  status.querySelector("span:last-child").textContent = worldAppReady ? "World App detectado" : "Modo navegador";
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
    setStat("statBurnPct", `${((burned / supply) * 100).toFixed(2)}% del supply`);
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

function openPufFallback() {
  // Respaldo: PUF Wallet abre la pagina del token RCOL para completar el cambio.
  const path = `/token/${RCOL_ADDRESS.toLowerCase()}`;
  window.open(`https://world.org/mini-app?app_id=${PUF_APP_ID}&path=${encodeURIComponent(path)}`, "_blank", "noreferrer");
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

async function ethCall(to, data) {
  const response = await fetch(WORLDCHAIN_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_call", params: [{ to, data }, "latest"] })
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
  });

  const ctaLabel = ctaButton.querySelector("span");
  const setCta = (text, disabled) => {
    ctaLabel.textContent = text;
    ctaButton.disabled = disabled;
    ctaButton.classList.toggle("is-busy", disabled);
  };

  ctaButton.addEventListener("click", async () => {
    const fromSym = fromSelect.value;
    const toSym = toSelect.value;
    const amount = parseFloat(amountInput.value);

    if (!(amount > 0)) {
      showToast("Ingresa una cantidad para cambiar");
      amountInput.focus();
      return;
    }

    if (!worldAppReady || !MiniKitApi) {
      showToast("Abre el hub en World App para firmar el swap");
      openPufFallback();
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
      showToast(`Swap enviado: ${amount} ${fromSym} a ${toSym}`);
      amountInput.value = "";
      renderQuote(null);
      setTimeout(loadMarketData, 12000);
    } catch (error) {
      console.error("Swap error:", error);
      const message = error?.message || error?.error_code || String(error);
      if (/reject|cancel|denied/i.test(message)) {
        showToast("Swap cancelado");
      } else {
        showToast(`Swap fallo: ${message}`);
      }
    } finally {
      setCta("Swap ahora", false);
    }
  });

  scheduleQuote();
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
}

/* ---------- Vistas (hub / nft) ---------- */

function setupViews() {
  const hero = document.querySelector(".hero");
  const hub = document.querySelector("#hubView");
  const nftView = document.querySelector("#nftView");
  const navLinks = Array.from(document.querySelectorAll(".bottom-nav a"));
  if (!hub || !nftView) return;

  const showView = (name) => {
    const isNft = name === "nft";
    if (hero) hero.hidden = isNft;
    hub.hidden = isNft;
    nftView.hidden = !isNft;
    navLinks.forEach((a) => {
      const href = a.getAttribute("href");
      a.classList.toggle("is-active", isNft ? href === "#nft" : href === "#appTitle");
    });
    window.scrollTo({ top: 0 });
    window.lucide?.createIcons?.();
  };

  const route = () => showView(location.hash === "#nft" ? "nft" : "hub");

  window.addEventListener("hashchange", route);

  // Los accesos del hub hacen scroll suave dentro de la vista hub.
  navLinks.forEach((a) => {
    const href = a.getAttribute("href");
    if (href === "#nft") return; // lo maneja el router por el hash
    a.addEventListener("click", (event) => {
      event.preventDefault();
      if (location.hash === "#nft") history.replaceState(null, "", location.pathname + location.search);
      showView("hub");
      const target = document.querySelector(href);
      if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
    });
  });

  document.querySelector("#nftBack")?.addEventListener("click", () => {
    history.replaceState(null, "", location.pathname + location.search);
    showView("hub");
  });

  setupScrollSpy(navLinks, nftView);
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
function setupScrollSpy(navLinks, nftView) {
  if (!("IntersectionObserver" in window)) return;
  const map = [
    [".hero", "#appTitle"],
    ["#section-market", "#section-market"],
    ["#section-swap", "#section-swap"],
    [".link-section", "#linksTitle"],
    ["#section-community", "#section-community"]
  ];
  const targets = map
    .map(([selector, href]) => ({ el: document.querySelector(selector), href }))
    .filter((target) => target.el);
  if (!targets.length) return;

  const setActive = (href) => {
    if (!nftView.hidden) return; // en la vista NFT manda la gema
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
  setupViews();
  setupNftModal();
  setupReveal();
  loadMarketData();

  const [config, installResult] = await Promise.all([loadConfig(), loadMiniKit()]);
  applyConfig(config);
  updateWorldStatus(installResult);

  document.querySelector("#copyToken").addEventListener("click", () => copyToken(config));
  document.querySelector("#shareButton").addEventListener("click", () => shareApp(config));
}

boot();
