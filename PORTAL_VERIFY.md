# Portal Worldcoin + Smoke Test — RCOL Hub

**URL producción:** https://rcol-hub.vercel.app/  
**Privacidad:** https://rcol-hub.vercel.app/privacy.html

**Última actualización:** 27 jun 2026

---

## Completado ✅

| Item | Estado |
|------|--------|
| Swap test en World App | ✅ Exitoso |
| Acción World ID `rcol-hub-access` | ✅ Creada en portal |
| `WORLD_ID_SIGNING_KEY` en Vercel | ✅ Configurada |
| Wallet Auth + Send Transaction | ✅ Habilitados |
| Privacy URL en portal | ✅ `https://rcol-hub.vercel.app/privacy.html` |

> **Deploy:** Tras push a `main`, Vercel publica `privacy.html` y `/api/*`. Si la URL da 404, espera 1–2 min o revisa el deploy en Vercel.

---

## Pendiente antes de Submit for Review

### Portal — contratos y tokens (confirmar whitelist)

- [ ] Permit2 — `0x000000000022D473030F116dDEE9F6B43aC78BA3`
- [ ] Universal Router — `0x8ac7bee993bb44dab564ea4bc9ea67bf9eb5e743`
- [ ] RCOL — `0x82bF7aA0680D9C2D6fFa77b995e2092fE68d308a`
- [ ] WLD, USDC, WETH (si el portal lo pide)

### Portal — metadata tienda

- [ ] Production URL: `https://rcol-hub.vercel.app/`
- [ ] Descripción sin “oficial”
- [ ] Logo 1024×1024
- [ ] Content card 345×240 → `assets/content-card-345x240.png`
- [ ] Showcase ×3 (1080×1080) → `assets/app-*-square.jpg`
- [ ] Meta tag (1200×600) → `assets/meta-tag-image.jpg`

### Smoke test restante

- [x] Swap pequeño completa
- [ ] World ID: botón **Verificar con World ID** → pill “Humano verificado”
- [ ] Enlaces PUF, X, Telegram, juegos
- [ ] Historial on-chain tras swap

---

## 4. Después del smoke test completo

1. Regenerar logo 1024×1024 (si hace falta)
2. Subir imágenes al portal
3. **Submit for Review** (2–5 días hábiles)

---

## Referencia rápida

| Dato | Valor |
|------|-------|
| World ID action | `rcol-hub-access` |
| World ID app_id | `app_a95edab5dd0638c6f02dcf3ff407694c` |
| World ID rp_id | `rp_013fbbe37584c9e5` |
| Permit2 | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |
| Universal Router | `0x8ac7bee993bb44dab564ea4bc9ea67bf9eb5e743` |
