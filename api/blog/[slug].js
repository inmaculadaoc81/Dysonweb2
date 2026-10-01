// GET /blog/:slug (vía rewrite de vercel.json) — un artículo publicado, con su texto Markdown convertido a HTML.
// Mismo ?org= que /api/blog.js: identifica a esta organización ante la API de Kelatos (ver blog.js para el motivo).
const { marked } = require("marked");
const { paginaLayout, pagina404, esc } = require("../_blog-layout");

const API_BASE = process.env.KELATOS_BLOG_API || "https://db.affirmatechnology.com/kelatos-api";
const ORG_KEY = "servicio_tecnico_dyson";
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

module.exports = async (req, res) => {
  try {
    const slug = String(req.query.slug || "");
    if (!SLUG_RE.test(slug)) {
      res.status(400).send("Solicitud no válida");
      return;
    }
    const r = await fetch(`${API_BASE}/publico/blog/${encodeURIComponent(slug)}?org=${ORG_KEY}`);
    if (r.status === 404) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.status(404).send(pagina404());
      return;
    }
    const data = await r.json().catch(() => null);
    if (!data || !data.ok || !data.post) {
      res.status(502).send("No se pudo cargar el artículo. Inténtalo de nuevo en unos minutos.");
      return;
    }
    const p = data.post;
    // El validador del backend prohíbe HTML en el cuerpo (solo Markdown): es seguro convertirlo tal cual.
    const cuerpoHtml = marked.parse(String(p.body || ""));
    const html = paginaLayout({
      title: `${p.title} | DysonTech`,
      description: p.description,
      canonical: `https://dysonweb2.vercel.app/blog/${p.slug}`,
      ogImage: p.image,
      tipo: "article",
      body: `<article class="blog-article"><div class="wrap">
        <span class="blog-cat">${esc(p.category || "")}</span>
        <h1 class="title">${esc(p.title)}</h1>
        <p class="blog-meta">${esc(p.date || "")} · ${esc(p.readingMinutes || 1)} min de lectura</p>
        ${p.image ? `<img class="blog-cover" src="${esc(p.image)}" alt="${esc(p.imageAlt || p.title)}">` : ""}
        <div class="blog-body">${cuerpoHtml}</div>
      </div></article>`,
    });
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=600");
    res.status(200).send(html);
  } catch (e) {
    console.error(e);
    res.status(502).send("No se pudo cargar el artículo. Inténtalo de nuevo en unos minutos.");
  }
};
