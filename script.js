document.addEventListener("DOMContentLoaded", () => {
  fetch("productos.json")
    .then((response) => response.json())
    .then((productos) => cargarTabla(productos))
    .catch((error) => console.error("Error al cargar JSON:", error));
});

function cargarTabla(productos) {
  const tbody = document.querySelector("#tablaProductos tbody");

  productos.forEach((producto, index) => {
    const tr = document.createElement("tr");
    const sku = producto["SKU / Codigo"];
    const marcada = localStorage.getItem(`ingresado-${sku}`) === "true";

    tr.innerHTML = `
      ${crearCeldaConBoton(producto["Titulo del Producto (H1)"], "H1", index)}
      ${crearCeldaConBoton(
        producto["Descripcion Optimizada (Texto Plano)"],
        "Descripcion",
        index
      )}
      ${crearCeldaConBoton(producto["SKU / Codigo"], "SKU", index)}
      ${crearCeldaConBoton(
        producto["Titulo SEO (Rank Math)"],
        "TituloSEO",
        index
      )}
      ${crearCeldaConBoton(
        producto["Metadescripcion (Rank Math)"],
        "MetaDescripcion",
        index
      )}
      ${crearCeldaConBoton(
        producto["Palabra Clave Principal"],
        "PalabraClavePrincipal",
        index
      )}
      ${crearCeldaConBoton(
        producto["Palabras Clave Secundarias"],
        "PalabrasClaveSecundarias",
        index
      )}
      ${crearCeldaConBoton(
        producto["Texto Alternativo (Alt Text)"],
        "AltText",
        index
      )}
      <td><input type="checkbox" onchange="marcarFila(this, '${sku}')" ${
      marcada ? "checked" : ""
    }></td>
    `;

    if (marcada) {
      tr.classList.add("marcada");
    }

    tbody.appendChild(tr);
  });

  // Asociar todos los botones de copiar después de que el DOM está generado
  document.querySelectorAll(".btn-copiar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const parent = btn.parentElement;
      const texto = decodeURIComponent(parent.dataset.texto);
      navigator.clipboard.writeText(texto).then(() => {
        const feedback = parent.querySelector(".copiado");
        feedback.textContent = "✓";
        setTimeout(() => {
          feedback.textContent = "";
        }, 2000);
      });
    });
  });
}

function crearCeldaConBoton(valor, campo, index, maxLength = 0) {
  const textoMostrado =
    maxLength && valor.length > maxLength
      ? valor.substring(0, maxLength) + "..."
      : valor;

  // Usa un contenedor para luego insertar el botón y asociar evento desde JS
  const tempId = `cell-${campo}-${index}`;

  return `
    <td>
      <div id="${tempId}" data-texto="${encodeURIComponent(valor)}">
        <div class="contenido">${textoMostrado}</div>
        <button class="btn-copiar">Copiar</button>
        <span class="copiado"></span>
      </div>
    </td>
  `;
}

function copiarValor(valor, idSpan) {
  navigator.clipboard.writeText(valor).then(() => {
    const span = document.getElementById(idSpan);
    span.textContent = "✓";
    setTimeout(() => {
      span.textContent = "";
    }, 2000);
  });
}

function marcarFila(checkbox, sku) {
  const fila = checkbox.closest("tr");
  const estado = checkbox.checked;
  fila.classList.toggle("marcada", estado);
  localStorage.setItem(`ingresado-${sku}`, estado);
}
