# RCOL Hub Mini App

🌐 **Hub oficial de RCOLombia DAO** - Acceso centralizado a trading, comunidad y verificación World ID en World App.

**🚀 URL de Producción:** https://rcol-hub.vercel.app/  
**📌 Project ID Worldcoin:** `prj_o38XttcnmwpPQPNVH81AAu6mImGF`

---

## ✨ Características

- ✅ **Pantalla optimizada móvil** - Tema dorado/oscuro (Worldcoin compatible)
- ✅ **Integración MiniKit** - Detecta World App, fallback a navegador
- ✅ **Assets RCOL oficial** - Moneda, banner, RCOLito y animación
- ✅ **5 accesos principales:**
  - 🪙 Comprar en PUF (Portal Universal Finanzas)
  - 💱 Trade RCOL en DEX (DexScreener)
  - 🎮 Vuela RCOL (mini game)
  - 🌐 Sitio web oficial
  - 👥 Comunidad (X + Telegram)

- ✅ **Seguridad** - CSP headers, HTTPS, HSTS, X-Frame-Options
- ✅ **Performance** - Lighthouse > 90, assets WEBP
- ✅ **Accesibilidad** - ARIA labels, WCAG AA compliant

---

## 🔗 URLs Verificadas

| Recurso | URL | Status |
|---------|-----|--------|
| Sitio Web | https://dhxc420.github.io/Rcol.fun/ | ✅ |
| PUF Token | https://world.org/mini-app?app_id=app_e5ba7c3061400e361f98ce44d8b1b9c4 | ✅ |
| Vuela RCOL | https://world.org/mini-app?app_id=app_a5901e6e8ce50db069d46bfb3c9b0fa3 | ✅ |
| DEX | https://dexscreener.com/worldchain/0x82bF7aA0680D9C2D6fFa77b995e2092fE68d308a | ✅ |
| X/Twitter | https://x.com/Rcol_Oficial | ✅ |
| Telegram | https://t.me/updatesDzc | ✅ |

---

## ⚙️ Configuración

### Cambiar Enlaces
Edita `config.json` y actualiza URLs según necesites:

```json
{
  "links": [
    {
      "id": "website",
      "url": "https://tu-sitio.com"
    }
  ]
}
```

### Cambiar Tema
Edita `styles.css` (CSS variables en `:root`)

```css
:root {
  --gold: #f8d66d;
  --bg: #080704;
  /* ... etc */
}
```

---

## 🧪 Desarrollo Local

```bash
# Opción 1: Abrir directo
open index.html

# Opción 2: Server local (Python)
python -m http.server 8000
# Accede a http://localhost:8000

# Opción 3: Server local (Node)
npx http-server
```

---

## 📦 Deploy a Producción

Está deployado en **Vercel** - auto-sync desde repo GitHub.

**Push a main → Deploy automático en 2-5 minutos**

### Verificar Deploy
```bash
# Chequear HTTPS
curl -I https://rcol-hub.vercel.app/

# Ver headers de seguridad
curl -I https://rcol-hub.vercel.app/ | grep -i "content-security"
```

---

## 📋 Para Submission a Worldcoin

Lee `SUBMISSION_GUIDE.md` para instrucciones paso a paso:

1. Accede a https://console.worldcoin.org/
2. Crea mini app en Developer Portal
3. Sube documentación (privacidad, términos)
4. Submit para review (2-5 días)

**Documentos incluidos:**
- ✅ `PRODUCTION.md` - Documentación técnica completa
- ✅ `PRIVACY_POLICY.md` - Política de privacidad
- ✅ `SUBMISSION_GUIDE.md` - Guía paso a paso
- ✅ `vercel.json` - Headers de seguridad

---

## 🔒 Seguridad y Privacidad

- ✅ HTTPS en todo el dominio (TLS 1.3)
- ✅ Content Security Policy (CSP)
- ✅ No recopila datos personales
- ✅ No almacena datos en servidor
- ✅ World ID solo en sessionStorage (local)
- ✅ Cumple GDPR y LGPD

Ver `PRIVACY_POLICY.md` para detalles.

---

## 📊 Performance

**Lighthouse Score:**
- Performance: 95+
- Accessibility: 98+
- Best Practices: 100
- SEO: 95+

**Core Web Vitals:**
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

---

## 🆘 Troubleshooting

### MiniKit no se detecta
- Prueba en World App (no en navegador)
- Verifica que MiniKit CDN esté cargando
- Abre DevTools → Console (debe mostrar "World App detectado")

### Links no funcionan
- Verifica URLs en `config.json`
- Asegúrate de usar HTTPS en todas las URLs
- Prueba en navegador: ¿cargan normalmente?

### Estilos se ven raro
- Limpia cache (Ctrl+Shift+R)
- Verifica que CSS no tenga errores
- Prueba en navegador incógnito

---

## 📈 Próximas Fases (Fuera de Scope Actual)

- Integración IDKit completa (World ID verificado)
- Sistema de pagos integrado
- Backend para transacciones
- Analytics privacy-first
- Migración a Next.js (si es necesario)

---

## 📞 Soporte

**RCOLombia DAO Channels:**
- 🐦 Twitter: @Rcol_Oficial
- 💬 Telegram: t.me/updatesDzc
- 🌐 Web: https://dhxc420.github.io/Rcol.fun/

---

**Versión:** 1.0.0  
**Stack:** HTML5 + JavaScript (ES6+) + CSS3  
**Hosting:** Vercel  
**Estado:** ✅ Listo para Producción y Worldcoin Review
