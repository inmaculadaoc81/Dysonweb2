DYSONTECH — SERVICIO TÉCNICO Y REPARACIÓN DYSON (MADRID)

Sitio multipágina grande: home + contacto + 12 páginas de servicio
(/servicios/) + 26 páginas de modelo (/modelos/) = 40 páginas en total,
todas comparten cabecera, chatbot n8n y footer.

DOMINIO:
https://reparacionrobotaspirador.com.es/
El sitio no tenía ningún dominio real configurado: no existía robots.txt
ni sitemap.xml, y no había canonical ni og:url en ninguna página. Se han
creado ambos ficheros y se ha añadido canonical/og/JSON-LD en index.html.
Confirmado por el cliente y aplicado en todos los ficheros.

REVISIÓN DE CÓDIGO:
- Menú móvil: no existía botón de menú (.links se ocultaba a partir de
  950px sin alternativa). Añadido .menu-btn + desplegable #mobileMenu en
  las 40 páginas del sitio. Como los desplegables de escritorio
  "Servicios" (12 enlaces) y "Modelos" (26 enlaces) son muy largos, en
  móvil se han convertido en dos <details> plegables dentro del menú, en
  vez de listar 38 enlaces sueltos.
- Chatbot y WhatsApp: existía un bloque de CSS al final del fichero
  ("Chatbot n8n visible en todas las páginas") con reglas
  .chat-window-toggle{bottom:22px!important} y
  .floatwa{bottom:92px!important} que dejaban el botón de WhatsApp POR
  ENCIMA del chat (orden invertido respecto al resto de la familia) y que
  además habrían entrado en conflicto con cualquier corrección nueva por
  el uso de !important. Eliminadas esas reglas conflictivas; ahora el
  chat se posiciona por encima del WhatsApp (bottom:96px vs bottom:24px),
  con borde blanco estándar y protección :not([class*="toggle"]) contra
  la colisión conocida de [class*="chat-window"].
- Datos schema.org: no existían en ninguna página. Añadido LocalBusiness
  en index.html con la dirección y teléfono visibles en la web, y
  enlaces de Maps/YouTube.
- Secciones eliminadas/reorganizadas por no tener sentido: la sección
  oscura "Productos Dyson que reparamos" repetía exactamente los mismos
  7 grupos de modelos que la sección "Modelos" de justo debajo, pero sin
  enlaces (solo texto). Se ha eliminado esa sección y sus 7 categorías se
  han integrado como subtítulos dentro de la sección "Modelos", que ahora
  agrupa los 26 modelos por familia (Aspiradoras de mano, Aspiradoras de
  suelo, Secadores, Ventiladores, Purificadores, Humidificadores, Línea
  profesional) en vez de una lista plana sin organizar.
- Copywriting del hero (portada), estilo problema-antes-que-servicio
  (enfoque Isra Bravo, sin copiar texto de terceros): el H1 pasó de
  "DysonTech Servicio Técnico y Reparación Dyson" (marca/servicio) a
  "Tu Dyson costó caro. Que se haya roto no significa que haya que
  tirarlo." + lead ampliando síntomas reales, la ventaja económica de
  reparar frente a comprar, y el diagnóstico antes de presupuestar.

CAMBIO IMPORTANTE — formulario de contacto:
api/contact.js usaba la API de Gmail vía OAuth2 (paquete "googleapis"),
distinto al resto de la familia. Sustituido por SMTP + nodemailer, mismo
endpoint /api/contact y mismos campos (name, phone, email, device,
message). package.json: quitado googleapis, añadido nodemailer, node
engine ajustado a 22.x.

Variables SMTP a configurar en Vercel (sustituyen a las de Google):
SMTP_HOST=cp7124.webempresa.eu
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=soporte@kelatos.com
SMTP_PASS=[configurada únicamente en Vercel]
CONTACT_EMAIL=soporte@kelatos.com

Las variables antiguas (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
GOOGLE_REFRESH_TOKEN, GOOGLE_EMAIL) ya no se usan y pueden eliminarse de
Vercel.
