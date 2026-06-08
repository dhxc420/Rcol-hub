# Guía de Submission a Worldcoin Developer Portal

## 📋 Pre-Submission Checklist

### Información Requerida ✅
- [x] **App Name:** RCOL Hub
- [x] **App Description:** Hub oficial de RCOLombia DAO - acceso a trading, comunidad y verificación World ID
- [x] **Production URL:** https://rcol-hub.vercel.app/
- [x] **Project ID:** prj_o38XttcnmwpPQPNVH81AAu6mImGF
- [x] **Category:** Financial / Community Hub
- [x] **Team Email:** (tu email de Worldcoin)

### Configuración Técnica ✅
- [x] **HTTPS:** Activo en todo el dominio
- [x] **MiniKit:** Integrado y detectado
- [x] **World ID:** Detectado (requiere IDKit backend para funcionalidad completa)
- [x] **Manifest:** manifest.json presente con iconos
- [x] **Icons:** Activos en 454x460px (WEBP)

### Documentación ✅
- [x] **README.md:** Descripción del proyecto
- [x] **PRODUCTION.md:** Documentación técnica completa
- [x] **PRIVACY_POLICY.md:** Política de privacidad
- [x] **vercel.json:** Headers de seguridad configurados

---

## 🚀 Pasos de Submission

### Paso 1: Verificar en Developer Portal

1. Ve a https://console.worldcoin.org/
2. Inicia sesión con tu cuenta de Worldcoin
3. Selecciona el proyecto `prj_o38XttcnmwpPQPNVH81AAu6mImGF`
4. Navega a **Mini Apps** → **Create Mini App** (si no existe)

### Paso 2: Información Básica

```
App Name:              RCOL Hub
Description:           Hub oficial de RCOLombia DAO - comunidad, 
                       trading y verificación con World ID
Short Description:     Portal centralizado para RCOL
Category:              Community / Finance
```

### Paso 3: URLs y Configuración

```
Production URL:        https://rcol-hub.vercel.app/
Icon URL:              https://rcol-hub.vercel.app/assets/rcol-coin.webp
Icon Size:             454x460px (WEBP)
```

### Paso 4: Permisos y Capacidades

```
World ID:              ✅ Usar (opcional - sin verificación requerida)
Share API:             ✅ Soportado
Haptics:               ✅ Soportado
Wallet:                ⚠️  No usado en esta versión
Transactions:          ⚠️  No procesadas en este mini app
```

### Paso 5: Privacidad

Pega el contenido de **PRIVACY_POLICY.md** en el campo de privacidad

### Paso 6: Términos

```
Términos personalizados: 
"Al usar RCOL Hub, aceptas que es un hub comunitario de RCOLombia DAO.
El trading ocurre en PUF o DEX (terceros). Worldcoin no es responsable
de transacciones. Verifica direcciones antes de enviar fondos."
```

---

## 🔍 Proceso de Review

### Worldcoin Revisará:

1. **Seguridad**
   - CSP headers ✅
   - HTTPS ✅
   - Sin vulnerabilidades obvias ✅
   - CORS correcto ✅

2. **Contenido**
   - Sin contenido ilegal ✅
   - Descripción clara ✅
   - Privacidad documentada ✅
   - Iconos apropiados ✅

3. **Funcionalidad**
   - Carga correctamente ✅
   - MiniKit detectado ✅
   - Sin errores 404 ✅
   - Responsive ✅

4. **Cumplimiento**
   - Sigue Community Guidelines ✅
   - GDPR compatible ✅
   - LGPD compatible ✅

### Tiempo de Review

- Típicamente: **2-5 días laborales**
- En casos complejos: **hasta 10 días**

### Posibles Resultados

#### ✅ Aprobado
- Aparece en World App
- Se propaga en 24-48h a todos los usuarios
- Puedes trackear installs en Analytics

#### 🟡 Cambios Requeridos
- Worldcoin te pedirá ajustes
- Tienes 14 días para responder
- Pueden incluir: privacidad, descripción, funcionalidad

#### ❌ Rechazado
- Razones comunes: contenido, seguridad, privacidad
- Puedes resubmitir después de correcciones

---

## 📊 Post-Approval

### Analytics Disponibles
- Installs/day
- Active users
- Retention
- Conversión a WLD trading
- Geographic data (anonimizada)

### Mejoras Futuras
- Integración con MiniKit Messaging
- Smart Contract calls
- Pagos en stablecoins
- Leaderboards de comunidad

---

## 🆘 Troubleshooting

### Si Dice "URL No Accesible"
```bash
# Verifica HTTPS
curl -I https://rcol-hub.vercel.app/
# Debe retornar 200 OK

# Verifica Headers
curl -I https://rcol-hub.vercel.app/ | grep -i content-security
```

### Si MiniKit No Se Detecta
- Verifica que estés en World App (no en navegador)
- Comprueba que loading script MiniKit es correcto
- Los console logs deben mostrar "World App detectado"

### Si Los Iconos No Cargan
- Verifica manifest.json paths
- Chequea CORS headers (debe permitir origin Worldcoin)
- Prueba directamente en browser: https://rcol-hub.vercel.app/assets/rcol-coin.webp

---

## 📝 Templates para Worldcoin Support

### Si Necesitas Help

**Email Template:**
```
Subject: Mini App Submission Support - RCOL Hub

Hi Worldcoin Team,

I'm submitting RCOL Hub (prj_o38XttcnmwpPQPNVH81AAu6mImGF).

URL: https://rcol-hub.vercel.app/
Category: Community/Finance
Status: [Pending Review / Needs Changes / Etc]

My question: [Tu pregunta específica]

Thanks!
```

---

## ✅ Última Verificación

Antes de submitir, verifica:

```bash
# 1. HTTPS
https://rcol-hub.vercel.app/ → 200 OK ✅

# 2. Manifest
curl https://rcol-hub.vercel.app/manifest.json → JSON válido ✅

# 3. CSP Header
curl -I https://rcol-hub.vercel.app/ | grep CSP → Presente ✅

# 4. Mobile responsive
Prueba en emulator o real device ✅

# 5. MiniKit loading
Abre en World App → debe decir "World App detectado" ✅

# 6. Links funcionan
Todos los CTAs clickeables y sin 404s ✅
```

---

**Versión:** 1.0  
**Última actualización:** 8 de junio de 2026  
**Status:** Listo para submission ✅
