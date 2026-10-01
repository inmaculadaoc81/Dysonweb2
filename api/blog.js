// GET /blog (vía rewrite de vercel.json) — listado de artículos publicados, leídos en vivo de la API de Kelatos.
// La organización se identifica con ?org=<clave> (la «key» de esta organización en Kelatos): un parámetro de la
// URL, no una cabecera, porque la API de Kelatos se expone detrás de un túnel de Cloudflare que reescribe
// X-Forwarded-Host con el suyo propio — ese header no llega intacto desde un sitio externo como este. Mismo
// contenido que dyfix.eu/blog: ambos sitios son la misma organización ("servicio_tecnico_dyson") en Kelatos.
const { paginaLayout, tarjetaArticulo } = require("./_blog-layout");

const API_BASE = process.env.KELATOS_BLOG_API || "https://db.affirmatechnology.com/kelatos-api";
const ORG_KEY = "servicio_tecnico_dyson";

module.exports = async (req, res) => {
  try {
    const r = await fetch(`${API_BASE}/publico/blog?org=${ORG_KEY}`);
    const data = await r.json().catch(() => null);
    const posts = data && data.ok && Array.isArray(data.posts) ? data.posts : [];
    const html = paginaLayout({
      title: "Blog | DysonTech Servicio Técnico Dyson",
      description: "Guías sobre averías, mantenimiento y reparación de aspiradoras, Supersonic, Airwrap y purificadores Dyson.",
      canonical: "https://dysonweb2.vercel.app/blog",
      body: `<section class="blog-hero"><div class="wrap"><div class="ey">Blog DysonTech</div><h1 class="title">Averías, mantenimiento y reparación de tu Dyson</h1><p class="lead">Guías claras para entender qué le pasa a tu aspiradora, Supersonic, Airwrap o purificador Dyson — y cuándo conviene repararlo.</p></div></section>
<section class="blog-list"><div class="wrap">${
        posts.length ? `<div class="blog-grid">${posts.map(tarjetaArticulo).join("")}</div>` : `<p class="lead">Todavía no hay artículos publicados. Vuelve pronto.</p>`
      }</div></section>`,
    });
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=600");
    res.status(200).send(html);
  } catch (e) {
    console.error(e);
    res.status(502).send("No se pudo cargar el blog. Inténtalo de nuevo en unos minutos.");
  }
};
