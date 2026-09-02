// middleware.mjs
//
// Dysonweb2 pasó de ser un sitio multipágina (con /servicios/...,
// /modelos/... y contacto.html, eliminados en este commit) a una
// sola página (one-page). Cualquier URL antigua que ya no forme
// parte del sitemap actual (que solo tiene "/") debe redirigir a la
// home en vez de dar un 404.
//
// El matcher de abajo excluye /api/* y cualquier ruta con extensión
// (archivos estáticos: .css, .js, .png, .svg, etc.), así que esta
// función solo se ejecuta para rutas "de página". Si esa ruta no es la
// home, se redirige (301) a "/".
//
// NOTA: este mismo patrón, ya usado en ~15 repos de la familia, se
// comprobó en producción (repo InformaticoChamberi, 2026-09-02) que
// NO está redirigiendo realmente en Vercel — las rutas antiguas dan
// 404 (X-Vercel-Error: NOT_FOUND) en vez de 301. Se mantiene aquí por
// consistencia con el resto de la familia mientras se investiga la
// causa raíz como tarea aparte; hasta entonces, las URLs antiguas
// muestran 404 en vez de redirigir.

import { next } from '@vercel/functions'

function normalize(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

export default function middleware(request) {
  const url = new URL(request.url)
  const normalized = normalize(url.pathname)

  if (normalized === '' || normalized === '/') {
    return next()
  }

  return Response.redirect(new URL('/', url.origin), 301)
}

export const config = {
  matcher: ['/((?!api/|.*\\..*).*)'],
}
