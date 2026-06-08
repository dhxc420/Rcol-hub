const CONFIG_URL = "./config.json";

const fallbackConfig = {
  brand: "RCOL Hub",
  headline: "Bienvenido al Hub Oficial de RCOLombia DAO",
  tagline: "Solo humanos verificados. Nuestra identidad, nuestro respaldo.",
  tokenAddress: "0x82bF7aA0680D9C2D6fFa77b995e2092fE68d308a",
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
      icon: "butterfly",
      accent: "#4ade80"
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
      id: "dex",
      title: "Trade RCOL en DEX",
      description: "DexScreener",
      url: "https://dexscreener.com/worldchain/0x82bF7aA0680D9C2D6fFa77b995e2092fE68d308a",
      icon: "chart-candlestick",
      accent: "#ff2d86"
    },
    {
      id: "chart",
      title: "Chart RCOL",
      description: "Buscar precio y pares",
      url: "https://dexscreener.com/worldchain/0x82bF7aA0680D9C2D6fFa77b995e2092fE68d308a",
      icon: "line-chart",
      accent: "#38bdf8"
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
let worldAppReady = false;
let activeConfig = null;

async function loadMiniKit() {
  try {
    const mod = await import("https://cdn.jsdelivr.net/npm/@worldcoin/minikit-js@1.11.0/+esm");
    MiniKitApi = mod.MiniKit;

    const looksLikeWorldApp = Boolean(window.WorldApp) || /WorldApp|MiniKit/i.test(navigator.userAgent);
    if (!looksLikeWorldApp) {
      return { success: false };
    }

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

function renderLinks(links) {
  const grid = document.querySelector("#linkGrid");
  grid.innerHTML = "";

  links.forEach((link) => {
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
      <span class="link-card__icon"><i data-lucide="${link.icon || "external-link"}" aria-hidden="true"></i></span>
      <span>
        <h3>${link.title}</h3>
        <p>${link.description}</p>
      </span>
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
  if (puf && !isPlaceholder(puf.url)) {
    document.querySelector("#pufCta").href = puf.url;
  }

  const dex = config.links.find((link) => link.id === "dex");
  if (dex && !isPlaceholder(dex.url)) {
    document.querySelector("#dexCta").href = dex.url;
  }

  renderLinks(config.links);
  renderCommunity(config.community || []);
  window.lucide?.createIcons?.();
}

function setIdentityState(state, message) {
  const panel = document.querySelector(".identity-panel");
  const mark = document.querySelector("#identityMark");
  const copy = document.querySelector("#identityMessage");

  panel.classList.remove("is-pending", "is-verified", "is-error", "is-browser");
  panel.classList.add(`is-${state}`);
  mark.innerHTML = `<i data-lucide="${state === "verified" ? "shield-check" : state === "pending" ? "loader-circle" : state === "browser" ? "monitor-smartphone" : "shield-alert"}"></i>`;
  copy.textContent = message;
  window.lucide?.createIcons?.();
}

async function verifyIdentity(config = activeConfig, options = {}) {
  if (!config) return;

  if (!worldAppReady) {
    setIdentityState("browser", "Abre esta mini app dentro de World App para verificar tu World ID.");
    if (options.manual) showToast("Abrela dentro de World App");
    return;
  }

  if (!config.worldIdAction) {
    setIdentityState("pending", "World App detectado. Falta configurar IDKit en el Developer Portal.");
    if (options.manual) showToast("Falta configurar IDKit");
    return;
  }

  setIdentityState("pending", "IDKit debe conectarse a un endpoint seguro antes de solicitar World ID.");
  if (options.manual) showToast("Configura IDKit backend");
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
  worldAppReady = Boolean(window.WorldApp) || Boolean(installResult?.success) || Boolean(MiniKitApi?.isInstalled?.());
  status.classList.toggle("is-ready", worldAppReady);
  status.classList.toggle("is-browser", !worldAppReady);
  status.querySelector("span:last-child").textContent = worldAppReady ? "World App detectado" : "Modo navegador";
}

async function boot() {
  const [config, installResult] = await Promise.all([loadConfig(), loadMiniKit()]);
  applyConfig(config);
  updateWorldStatus(installResult);

  document.querySelector("#copyToken").addEventListener("click", () => copyToken(config));
  document.querySelector("#shareButton").addEventListener("click", () => shareApp(config));
  document.querySelector("#verifyButton").addEventListener("click", () => verifyIdentity(config, { manual: true }));

  if (worldAppReady && config.worldIdAction && sessionStorage.getItem("rcol-world-id-status") !== "verified") {
    setTimeout(() => verifyIdentity(config), 700);
  } else if (sessionStorage.getItem("rcol-world-id-status") === "verified") {
    setIdentityState("verified", "World ID ya verificado en esta sesion.");
  } else {
    setIdentityState("browser", "Abre esta mini app dentro de World App para verificar tu World ID.");
  }
}

boot();
