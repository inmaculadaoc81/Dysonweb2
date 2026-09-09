(function () {
  // Lee el catálogo de servicios/precios directamente del dashboard de
  // Kelatos (kelatos-rep-back) — sin base de datos propia en esta web. El
  // slug "dysonweb2" corresponde a esta web, enlazada al catálogo
  // compartido "Servicios Dyson" (varias webs de la marca sirven los
  // mismos datos; editar un precio en el catálogo se refleja aquí solo).
  var ENDPOINT = "https://makeup-reef-raymond-holes.trycloudflare.com/publico/productos/dysonweb2";

  var contenedor = document.getElementById("servicios-lista");
  if (!contenedor) return;

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatearPrecio(precio) {
    var n = precio === null || precio === undefined || precio === "" ? null : Number(precio);
    if (n === null || isNaN(n)) return '<div class="servicio-precio consultar">Consultar precio</div>';
    return '<div class="servicio-precio">' + n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €</div>";
  }

  function tarjeta(p) {
    var imagen = p.imagen_url
      ? '<img class="servicio-img" src="' + escapeHtml(p.imagen_url) + '" alt="' + escapeHtml(p.nombre) + '" loading="lazy">'
      : '<div class="servicio-img-placeholder" aria-hidden="true">DT</div>';
    var modelo = p.categoria ? '<div class="servicio-categoria">' + escapeHtml(p.categoria) + "</div>" : "";
    return (
      '<article class="servicio-card">' +
      imagen +
      '<div class="servicio-body">' +
      modelo +
      '<h3 class="servicio-nombre">' + escapeHtml(p.nombre) + "</h3>" +
      formatearPrecio(p.precio) +
      "</div></article>"
    );
  }

  fetch(ENDPOINT, { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      var productos = data && data.ok && Array.isArray(data.productos) ? data.productos : [];
      if (!productos.length) {
        contenedor.innerHTML = '<p class="servicios-vacio">Muy pronto publicaremos aquí el listado completo de precios. Mientras tanto, escríbenos y te lo confirmamos al momento.</p>';
        return;
      }
      contenedor.innerHTML = productos.map(tarjeta).join("");
    })
    .catch(function () {
      contenedor.innerHTML = '<p class="servicios-vacio">No hemos podido cargar los precios ahora mismo. Escríbenos y te los confirmamos al momento.</p>';
    });
})();
