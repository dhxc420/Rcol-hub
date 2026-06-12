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

const SWAP_TOKENS = [
  { symbol: "RCOL", name: "RCOL", address: RCOL_ADDRESS },
  { symbol: "WLD", name: "Worldcoin", address: "0x2cFc85d8E48F8EAB294be644d9E25C3030863003" },
  { symbol: "USDC", name: "USD Coin", address: "0x79A02482A880bCE3F13e09Da970dC34db4CD24d1" },
  { symbol: "WETH", name: "Ethereum", address: "0x4200000000000000000000000000000000000006" }
];

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

    // Mismo modulo que usa el SDK de swap (via import map) para compartir la instancia instalada.
    const mod = await import("@worldcoin/minikit-js");
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

  updateSwapQuote();
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

/* ---------- Motor de swap (HoldStation SDK + MiniKit) ---------- */

const SLIPPAGE = "0.5";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
let swapEnginePromise = null;

function getSwapEngine() {
  if (!swapEnginePromise) {
    swapEnginePromise = (async () => {
      const [{ ethers }, sdk, adapter] = await Promise.all([
        import("ethers"),
        import("@holdstation/worldchain-sdk"),
        import("@holdstation/worldchain-ethers-v6")
      ]);

      const provider = new ethers.JsonRpcProvider(
        WORLDCHAIN_RPC,
        { chainId: 480, name: "worldchain" },
        { staticNetwork: true }
      );
      const client = new adapter.Client(provider);
      sdk.config.client = client;
      sdk.config.multicall3 = new adapter.Multicall3(provider);

      const tokenProvider = new sdk.TokenProvider({ client, multicall3: sdk.config.multicall3 });
      const swapHelper = new sdk.SwapHelper(client, { tokenStorage: sdk.inmemoryTokenStorage });
      swapHelper.load(new sdk.ZeroX(tokenProvider, sdk.inmemoryTokenStorage));
      swapHelper.load(new sdk.HoldSo(tokenProvider, sdk.inmemoryTokenStorage));
      return swapHelper;
    })().catch((error) => {
      swapEnginePromise = null;
      throw error;
    });
  }
  return swapEnginePromise;
}

function openPufFallback() {
  // Fallback: PUF Wallet abre la pagina del token RCOL para completar el cambio.
  const path = `/token/${RCOL_ADDRESS.toLowerCase()}`;
  window.open(`https://world.org/mini-app?app_id=${PUF_APP_ID}&path=${encodeURIComponent(path)}`, "_blank", "noreferrer");
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
    updateSwapQuote();
  });
  toSelect.addEventListener("change", () => {
    enforcePair(toSelect);
    updateSwapQuote();
  });
  amountInput.addEventListener("input", updateSwapQuote);

  invertButton.addEventListener("click", () => {
    const previousFrom = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = previousFrom;
    updateSwapQuote();
  });

  const ctaLabel = ctaButton.querySelector("span");
  const setCta = (text, disabled) => {
    ctaLabel.textContent = text;
    ctaButton.disabled = disabled;
    ctaButton.classList.toggle("is-busy", disabled);
  };

  ctaButton.addEventListener("click", async () => {
    const amount = parseFloat(amountInput.value);
    if (!(amount > 0)) {
      showToast("Ingresa una cantidad para cambiar");
      amountInput.focus();
      return;
    }

    if (!worldAppReady) {
      showToast("Abre el hub en World App para firmar el swap");
      openPufFallback();
      return;
    }

    const from = SWAP_TOKENS.find((token) => token.symbol === fromSelect.value);
    const to = SWAP_TOKENS.find((token) => token.symbol === toSelect.value);
    const params = {
      tokenIn: from.address,
      tokenOut: to.address,
      amountIn: String(amount),
      slippage: SLIPPAGE,
      fee: "0"
    };

    try {
      setCta("Cotizando...", true);
      const swapHelper = await getSwapEngine();
      const quote = await swapHelper.estimate.quote(params);

      setCta("Confirma en tu wallet...", true);
      const result = await swapHelper.swap({
        ...params,
        tx: { data: quote.data, to: quote.to, value: quote.value },
        feeAmountOut: quote.addons?.feeAmountOut,
        feeReceiver: ZERO_ADDRESS
      });

      if (result.success) {
        showToast(`Swap enviado: ${amount} ${from.symbol} -> ${to.symbol}`);
        amountInput.value = "";
        updateSwapQuote();
        setTimeout(loadMarketData, 10000);
      } else {
        showToast(`Swap rechazado (${result.errorCode || "error"})`);
      }
    } catch (error) {
      console.error("Swap error:", error);
      showToast("No se pudo cotizar el swap, abriendo PUF Wallet");
      openPufFallback();
    } finally {
      setCta("Swap ahora", false);
    }
  });

  updateSwapQuote();
}

function updateSwapQuote() {
  const fromSelect = document.querySelector("#swapFrom");
  const toSelect = document.querySelector("#swapTo");
  const amountInput = document.querySelector("#swapAmount");
  const output = document.querySelector("#swapOut");
  const fromUsd = document.querySelector("#swapFromUsd");
  const toUsd = document.querySelector("#swapToUsd");
  if (!fromSelect || !toSelect || !output) return;

  const amount = parseFloat(amountInput.value) || 0;
  const priceFrom = tokenPrices[fromSelect.value];
  const priceTo = tokenPrices[toSelect.value];

  if (amount > 0 && priceFrom > 0 && priceTo > 0) {
    const usdValue = amount * priceFrom;
    output.textContent = formatTokenAmount(usdValue / priceTo);
    fromUsd.textContent = `≈ $${formatPrice(usdValue)}`;
    toUsd.textContent = `≈ $${formatPrice(usdValue)} · precio DexScreener`;
  } else {
    output.textContent = "0.0";
    fromUsd.innerHTML = "&nbsp;";
    toUsd.textContent = amount > 0 ? "Cargando precios..." : " ";
  }
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
