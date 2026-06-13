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

const SWAP_TOKENS = [
  { symbol: "RCOL", name: "RCOL", address: RCOL_ADDRESS, decimals: 18 },
  { symbol: "WLD", name: "Worldcoin", address: WLD_ADDRESS, decimals: 18 },
  { symbol: "USDC", name: "USD Coin", address: "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1", decimals: 6 },
  { symbol: "WETH", name: "Ethereum", address: "0x4200000000000000000000000000000000000006", decimals: 18 }
];

// RCOL solo tiene liquidez contra WLD (pool Uniswap v2 en Worldchain).
// Cualquier otro token se enruta a traves de WLD.
const UNISWAP_V2_ROUTER = "0x541aB7c31A119441eF3575F6973277DE0eF460bd";
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
  ]
};

let MiniKitApi = null;
let activeConfig = null;
let worldAppReady = false;
const tokenPrices = {};

async function loadMiniKit() {
  try {
    const looksLikeWorldApp = Boolean(window.WorldApp) || /WorldApp|MiniKit/i.test(navigator.userAgent);
    if (!looksLikeWorldApp) return { success: false };

    const mod = await import("https://cdn.jsdelivr.net/npm/@worldcoin/minikit-js@1.11.0/+esm");
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

function isPlaceholder(url) {
  return !url || url.startsWith("#pendiente");
}

function isInternalAnchor(url) {
  return url?.startsWith("#") && !isPlaceholder(url);
}

function renderIcon(link) {
  if (link.isImage) {
    return `<img src="${link.icon}" alt="" loading="lazy" />`;
  }

  return `<i data-lucide="${link.icon || "external-link"}" aria-hidden="true"></i>`;
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
          <h3>${link.title}</h3>
          <span class="link-card__actions">
            ${link.actions
              .map(
                (action) =>
                  `<a href="${action.url}" target="_blank" rel="noreferrer">${action.label}</a>`
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
        <h3>${link.title}</h3>
        <p>${link.description}</p>
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
      <i data-lucide="${item.icon || "link"}" aria-hidden="true"></i>
      <span>${item.title}<small>${item.handle}</small></span>
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

  renderLinks(config.links);
  renderCommunity(config.community || []);
  window.lucide?.createIcons?.();
}

async function copyToken(config) {
  try {
    await navigator.clipboard.writeText(config.tokenAddress);
    showToast("Contrato copiado");
  } catch {
    showToast(config.tokenAddress);
  }
}

async function shareApp(config) {
  const website = config.links.find((link) => link.id === "website");
  const shareUrl = website?.url || location.href;
  const text = `${config.brand}: ${config.tagline}`;

  try {
    if (MiniKitApi?.share) {
      await MiniKitApi.share({ title: config.brand, text, url: shareUrl });
      return;
    }

    if (navigator.share) {
      await navigator.share({ title: config.brand, text, url: shareUrl });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    showToast("Link copiado para compartir");
  } catch {
    showToast("No se pudo compartir ahora");
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
  }

  scheduleQuote();
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
  Promise.allSettled([fetchDexData(), fetchHolders(), fetchBurned()]);
}

/* ---------- Motor de swap (Uniswap v2 directo + MiniKit) ---------- */

const ERC20_APPROVE_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }]
  }
];

const V2_SWAP_ABI = [
  {
    name: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMin", type: "uint256" },
      { name: "path", type: "address[]" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" }
    ],
    outputs: []
  }
];

const tokenBySymbol = Object.fromEntries(SWAP_TOKENS.map((token) => [token.symbol, token]));
let cachedWalletAddress = null;
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

async function getWalletAddress() {
  if (cachedWalletAddress) return cachedWalletAddress;
  const known = MiniKitApi?.user?.walletAddress;
  if (known) {
    cachedWalletAddress = known;
    return known;
  }
  const nonce = (Math.random().toString(36) + Date.now().toString(36)).replace(/[^a-z0-9]/g, "").slice(0, 16);
  const { finalPayload } = await MiniKitApi.commandsAsync.walletAuth({
    nonce,
    statement: "Conecta tu wallet para hacer swap en RCOL Hub",
    expirationTime: new Date(Date.now() + 10 * 60 * 1000)
  });
  if (finalPayload?.status === "success" && finalPayload.address) {
    cachedWalletAddress = finalPayload.address;
    return finalPayload.address;
  }
  return null;
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

      setCta("Conectando wallet...", true);
      const address = await getWalletAddress();
      if (!address) {
        showToast("No se pudo conectar la wallet");
        return;
      }

      const deadline = BigInt(Math.floor(Date.now() / 1000) + SWAP_DEADLINE_MIN * 60);

      setCta("Confirma en tu wallet...", true);
      const { finalPayload } = await MiniKitApi.commandsAsync.sendTransaction({
        transaction: [
          {
            address: fromToken.address,
            abi: ERC20_APPROVE_ABI,
            functionName: "approve",
            args: [UNISWAP_V2_ROUTER, amountInWei.toString()]
          },
          {
            address: UNISWAP_V2_ROUTER,
            abi: V2_SWAP_ABI,
            functionName: "swapExactTokensForTokensSupportingFeeOnTransferTokens",
            args: [amountInWei.toString(), minOut.toString(), path, address, deadline.toString()]
          }
        ]
      });

      if (finalPayload?.status === "success") {
        showToast(`Swap enviado: ${amount} ${fromSym} a ${toSym}`);
        amountInput.value = "";
        renderQuote(null);
        setTimeout(loadMarketData, 12000);
      } else if (finalPayload?.error_code === "user_rejected") {
        showToast("Swap cancelado");
      } else {
        showToast(`No se completo el swap (${finalPayload?.error_code || "error"})`);
      }
    } catch (error) {
      console.error("Swap error:", error);
      showToast("No se pudo completar el swap, intenta de nuevo");
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

/* ---------- Boot ---------- */

async function boot() {
  setupTheme();
  setupSwap();
  loadMarketData();

  const [config, installResult] = await Promise.all([loadConfig(), loadMiniKit()]);
  applyConfig(config);
  updateWorldStatus(installResult);

  document.querySelector("#copyToken").addEventListener("click", () => copyToken(config));
  document.querySelector("#shareButton").addEventListener("click", () => shareApp(config));
}

boot();
