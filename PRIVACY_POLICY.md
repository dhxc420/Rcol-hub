# Política de Privacidad — RCOL Hub

**Última actualización:** 27 de junio de 2026  
**URL pública:** https://rcol-hub.vercel.app/privacy.html

## 1. Información que recopilamos

### Datos automáticos (servidor / hosting)
- Dirección IP (logs del hosting Vercel)
- User-Agent del navegador
- Tipo de dispositivo
- Timestamps de acceso

### Datos en World App (cliente)
Cuando usas RCOL Hub dentro de **World App**:
- **Wallet:** al conectar, leemos tu dirección pública y `@username` vía MiniKit para mostrar saldos y firmar swaps. No guardamos la dirección en nuestros servidores.
- **World ID:** si verificas con World ID, enviamos la prueba criptográfica a la API de Worldcoin (`developer.world.org`) para validarla. No recibimos datos biométricos ni documentos.
- **Sesión local:** guardamos en `sessionStorage` si completaste la verificación (`rcol-world-id-verified`) hasta que cierres la pestaña.

### Datos que NO almacenamos en servidores propios
- Historial de navegación
- Cookies de seguimiento publicitario
- Email o teléfono
- Claves privadas
- Historial de transacciones (el historial de swap se lee on-chain en tu dispositivo)

## 2. Cómo usamos la información

- Mostrar precios, saldos y ejecutar swaps que **tú** firmas con tu wallet
- Verificar humanidad con World ID cuando lo solicitas
- Diagnosticar errores técnicos y prevenir abuso
- Cumplir obligaciones legales aplicables

## 3. Integración con Worldcoin / Tools for Humanity

RCOL Hub es una **mini app de terceros**, no desarrollada ni respaldada por Worldcoin.

- **MiniKit:** wallet auth, transacciones y compartir
- **World ID (IDKit):** verificación opcional de humano único
- Política de Worldcoin: https://world.org/privacy

## 4. Terceros

Enlaces a servicios externos con sus propias políticas:
- PUF (World App)
- Uniswap v2 en Worldchain
- DexScreener / GeckoTerminal
- Alchemy RPC (lectura on-chain)

## 5. Seguridad

- HTTPS en todo el sitio
- Headers de seguridad (CSP, HSTS)
- La clave de firma World ID (`WORLD_ID_SIGNING_KEY`) solo existe en el servidor Vercel, nunca en el navegador

## 6. Tus derechos

Puedes solicitar información sobre datos que tengamos o su eliminación contactándonos.

## 7. Cambios

Publicaremos cambios en esta misma URL.

## 8. Contacto

- Telegram: https://t.me/updatesDzc
- X: https://x.com/Rcol_Oficial
- Web: https://dhxc420.github.io/Rcol.fun/

---

**RCOLombia DAO** · RCOL Hub Mini App
