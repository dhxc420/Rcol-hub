# Checklist de Submission a Revisión — RCOL Hub

**Fecha:** 18 de junio de 2026
**URL producción:** https://rcol-hub.vercel.app/ (verificado: HTTP 200 ✅)

> ⚠️ **IMPORTANTE — qué cambió desde la versión anterior:** la app ahora **conecta wallet
> (walletAuth)** y **envía transacciones on-chain (el swap)**. Los docs viejos decían
> "wallet/transactions: no usado" — eso ya NO es cierto. Esto cambia lo que debes declarar
> en el Developer Portal (ver sección 1).

---

## 1. Developer Portal — Configuración (lo más importante)

Entra a https://developer.worldcoin.org → tu mini app → Configuration.

- [ ] **Wallet Auth (Sign in with wallet):** habilitado. La app llama `MiniKit.walletAuth`
      para conectar la wallet y mostrar el portafolio.
- [ ] **Send Transaction:** habilitado. La app firma el swap con `MiniKit.sendTransaction`.
- [ ] **Contratos whitelisteados** (Advanced → Contract entrypoints). El swap llama a:
  - [ ] Permit2 — `0x000000000022D473030F116dDEE9F6B43aC78BA3`
  - [ ] Universal Router — `0x8ac7bee993bb44dab564ea4bc9ea67bf9eb5e743`
  > Tu swap ya funcionó en mainnet (tx `0x611863fe...`), así que probablemente ya están.
  > Confirma que sigan whitelisteados en la versión que envías a revisión, no solo en el draft.
- [ ] **Tokens permitidos** (si el portal lo pide para mover tokens): RCOL
      `0x82bF7aA0680D9C2D6fFa77b995e2092fE68d308a`, WLD, USDC, WETH.
- [ ] **App ID** coincide con el de producción (no el de draft).
- [ ] **NO** declarar World ID / Incognito Actions si no se usa verificación real
      (la app usa walletAuth, no pruebas de World ID). No prometer lo que no hace.

## 2. Metadata de la tienda

- [ ] **Nombre:** RCOL Hub
- [ ] **Descripción corta** clara (qué hace: hub de RCOL — mercado, swap, comunidad, juegos).
- [ ] **Categoría:** Finance / Community.
- [ ] **Ícono** 1024x1024 (o el tamaño que pida el portal) nítido y sin texto recortado.
- [ ] **Screenshots** actualizados: incluir la vista de **swap** y el **portafolio**
      (son lo más vistoso y demuestran funcionalidad real).
- [ ] **Idioma:** español (coincide con la UI).

## 3. Verificación técnica (ya validado ✅)

- [x] Producción responde HTTP 200.
- [x] CSP cubre todas las conexiones: Alchemy RPC, explorer, dexscreener, geckoterminal,
      world.org, usernames.worldcoin.org, jsdelivr (MiniKit), unpkg (lucide).
- [x] `frame-ancestors 'self' https://world.org` (World App puede embeber la app).
- [x] HSTS, X-Frame-Options, X-Content-Type-Options configurados.
- [x] manifest.json válido con íconos.
- [x] Assets locales (logos de tokens incluidos, sin depender de coingecko en runtime).
- [ ] Confirmar que el último commit está desplegado en Vercel antes de enviar.

## 4. Smoke test final dentro de World App (hazlo tú mismo)

- [ ] Abrir la mini app → el pill dice "World App detectado".
- [ ] Conectar wallet → aparece tu @usuario y el portafolio con saldos reales.
- [ ] Vista swap → cotización en vivo se actualiza al escribir un monto.
- [ ] Hacer un swap pequeño → se firma y completa (ya probado ✅, tx exitosa).
- [ ] El historial muestra el swap (badge On-chain).
- [ ] La nota "en PUF la comisión es 1%" aparece y abre PUF.
- [ ] Probar el botón "Comprar en PUF" y los enlaces de comunidad (sin 404).
- [ ] Sin errores en consola.

## 5. Contenido y cumplimiento

- [x] Política de privacidad publicada (PRIVACY_POLICY.md).
- [x] **Transparencia de comisiones:** la app avisa que en PUF se paga 1% vs ~2% del swap
      directo (buen punto a favor en revisión).
- [ ] Aviso de que el trading es con terceros (PUF / pool) y conlleva riesgo — incluirlo
      en la descripción o términos.
- [ ] Sin contenido engañoso ni promesas de rendimiento ("inversión garantizada", etc.).
- [ ] El swap muestra que RCOL cobra ~2% de impuesto (ya está en la nota del panel).

## 6. Enviar

- [ ] Revisar todo lo anterior → **Submit for Review**.
- [ ] Tiempo estimado: 2–5 días hábiles.
- [ ] Si piden cambios, hay ~14 días para responder.

---

## Datos de referencia

| Dato | Valor |
|------|-------|
| URL | https://rcol-hub.vercel.app/ |
| Token RCOL | `0x82bF7aA0680D9C2D6fFa77b995e2092fE68d308a` |
| Pool RCOL/WLD | `0xe5f1c6b95cf182b09807b73f21f622fae08dd439` |
| Permit2 | `0x000000000022D473030F116dDEE9F6B43aC78BA3` |
| Universal Router | `0x8ac7bee993bb44dab564ea4bc9ea67bf9eb5e743` |
| Swap de prueba exitoso | `0x611863fed99d985baa54225609020e34dd1dd713dba26e70714e4defe2f8a5ed` |
