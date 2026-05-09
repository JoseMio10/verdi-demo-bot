# 🌿 Verdi Bot — Demo

Asistente conversacional inteligente para Inversiones Verdi (Verdi Naturals).

## Para qué sirve esta demo

Mostrarle al equipo de RR.HH. y dirección la **capacidad y mejora** que ofrece automatizar las respuestas de delivery/atención al cliente con IA, comparado con responder manualmente.

## Cómo correrlo localmente

### 1. Instalar dependencias
```bash
cd verdi-demo-bot
npm install
```

### 2. Configurar tu API key de OpenAI

**Windows (CMD):**
```cmd
set OPENAI_API_KEY=sk-tu-clave-aqui
```

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="sk-tu-clave-aqui"
```

### 3. Iniciar el servidor
```bash
npm start
```

Abre http://localhost:3000

## Cómo desplegar a una URL pública (Vercel)

1. Crea cuenta gratis en https://vercel.com
2. Instala Vercel CLI: `npm i -g vercel`
3. Desde la carpeta del proyecto: `vercel`
4. Cuando pregunte por variables de entorno, agrega:
   - `OPENAI_API_KEY` = tu API key

Te dará una URL pública tipo `https://verdi-demo-bot.vercel.app` que puedes compartir.

## Estructura

```
verdi-demo-bot/
├── public/
│   ├── index.html      ← Frontend (chat UI)
│   ├── styles.css      ← Estilos branding Verdi
│   └── app.js          ← Lógica del chat
├── api/
│   └── chat.js         ← Endpoint serverless OpenAI (Vercel)
├── server.js           ← Servidor local Node
├── productos.json      ← Catálogo + info empresa + envíos
├── package.json
└── vercel.json         ← Config deploy Vercel
```

## Capacidades del bot

- ✅ Conoce los 6 productos del catálogo (precios, dosis, ingredientes)
- ✅ Conoce políticas de envío (regla 10AM Lima Metropolitana)
- ✅ Conoce formas de pago (Yape, Mercado Pago, tarjetas, PagoEfectivo)
- ✅ Conoce políticas de devolución (7 días)
- ✅ Entiende errores tipográficos
- ✅ Recomienda alternativas si no tenemos un producto
- ✅ Recomienda por síntoma (hinchazón → Probiotic for Bloat)
- ✅ Cierra venta sutilmente
- ✅ No inventa información

## Próximos pasos si se aprueba

Conectar el mismo backend a:
- WhatsApp Business API (vía Twilio o BSP profesional)
- Instagram Direct
- Messenger
- Web chat embebido en inversionesverdi.com
