DYSONTECH — SERVICIO TÉCNICO Y REPARACIÓN DYSON (MADRID)

REVISIÓN ADICIONAL (a petición del cliente):
- BUG REAL — "no tiene calendar para citas": no existía ninguna
  sección de Cal.com en las 40 páginas del sitio. Añadida en
  index.html (home), justo después de la sección "proof"
  (Google Business / YouTube): "Reserva una cita de 30 minutos" con el
  iframe compartido de la familia
  (https://cal.com/kelatos/30min?embed=true&theme=light), 720px de
  alto en escritorio y 760px en móvil. Añadido enlace "Pedir cita" al
  menú (desktop y móvil) en las 40 páginas, ya que comparten la misma
  cabecera.
- SOBRE "no tiene casilla de política de privacidad en el formulario":
  revisado el código de contacto.html y la casilla SÍ existe y SÍ
  enlaza correctamente a https://kelatos.com/privacy-policy/ (se
  añadió en una pasada anterior de este mismo repositorio). BUG REAL
  DETECTADO, pero no de código: al comprobar en directo
  https://reparacionrobotaspirador.com.es/contacto.html, el dominio
  devuelve HTTP 404 con cabeceras de WordPress
  (Link: .../wp-json/), es decir, ese dominio actualmente NO apunta a
  este despliegue de Vercel, sino a otra instalación (WordPress) o no
  está enrutado correctamente. Por eso lo que se ve en producción no
  coincide con este repositorio. Esto no se puede corregir desde el
  código: hay que revisar en el proveedor del dominio / en Vercel
  (Project Settings → Domains) que reparacionrobotaspirador.com.es
  esté correctamente apuntado a este proyecto (dysonweb2).

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
- Quitadas las pills de categoría (Aspiradoras, Supersonic, Airwrap...)
  del hero, por ser redundantes con las secciones de más abajo.
- Añadida sección de contenido SEO propio (#guia), enlazada en el menú
  de escritorio y en el móvil, con texto sobre reparar vs. comprar,
  diagnóstico previo y catálogo trabajado.
- Sección "Modelos" reducida: antes listaba los 26 modelos como enlaces
  sueltos en 4 columnas; ahora son 7 tarjetas de categoría (mismo
  formato que "Servicios") en 2 columnas, con 2-3 modelos de ejemplo por
  categoría en vez de mencionarlos todos. El listado completo de los 26
  sigue disponible en el desplegable "Modelos" del menú.
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

REVISIÓN ADICIONAL (checklist unificado de la familia, a petición del cliente):
- H1 verificado: "Tu Dyson costó caro. Aquí lo reparamos, no lo tires."
  ya es afirmativo, corto y con estructura distinta a la de los repos
  hermanos DyFix y DysonValladolid (enfoque en el coste, no en el
  síntoma). No se ha tocado.
- BUG REAL — el botón CTA de teléfono del hero no tenía icono, a
  diferencia del de WhatsApp. Añadido (verificado con cuidado el
  cierre de las etiquetas </a> en las 40 páginas: aperturas = cierres
  en todas).
- La casilla de política de privacidad (en contacto.html) existía pero
  el texto no enlazaba a ningún sitio. Añadido el enlace estándar de
  la familia a https://kelatos.com/privacy-policy/, resaltado en azul.
- Añadida franja de aviso de servicio técnico independiente debajo del
  menú, en las 40 páginas del sitio (home, contacto y las 38 páginas
  de /servicios/ y /modelos/, que comparten cabecera idéntica).
  Verificado antes que .header no usa display:flex directamente, solo
  su .nav interno.
- Añadido "Sábados, domingos y días festivos estamos cerrados" debajo
  del horario, en la caja de información del hero (index.html).
- Verificado sin bugs: no existe ninguna etiqueta rotada tipo
  .hero-chip/.hero-tag/.hero-pill/.hero-label (el único elemento
  rotado, .hero-panel::before, es una forma decorativa de fondo sin
  texto de etiqueta, no una píldora); el texto decorativo
  ".hero-panel::after" ("DYSON") es de solo 54px, no es un watermark
  gigante y no necesita reducción; schema.org ya usaba correctamente
  el teléfono de la caja de información (+34 910 05 48 17); el
  formulario ya estaba correctamente conectado a /api/contact (mismo
  nombre de archivo que api/contact.js, verificado en form.js).

REVISIÓN ADICIONAL (pasada posterior):
- Google Analytics: no existía en ninguna página. Añadido G-2VR5SWEFKX
  en las 40 páginas del sitio (home, contacto y las 38 páginas de
  /servicios/ y /modelos/).
- H1 acortado a formato afirmativo (≤10 palabras, sin interrogación ni
  condicionales) — el anterior tenía 14 palabras: "Tu Dyson costó
  caro. Aquí lo reparamos, no lo tires." No se ha tocado el tamaño del
  H1: ya estaba en clamp(44-68px) en escritorio (en línea con el
  estándar de la familia), y la reducción a 32px en móvil es una
  decisión previa y documentada ("Corrige el hero en móvil: H1 más
  pequeño...") para evitar solapes, se respeta tal cual.
- No aplica middleware.mjs: las 38 páginas de /servicios/ y /modelos/
  son contenido original activo, no hay eliminaciones en el historial
  (sitio legítimamente multipágina).
- Ya estaba bien (sin tocar): banner de cookies, schema.org, menú
  móvil, chatbot con borde y posicionamiento correctos, teléfono, y la
  píldora .phone de la cabecera (ya con texto corto, sin bug de
  desbordamiento).
