document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("autoresContainer");
    const btnResaltar = document.getElementById("btnResaltarAutores");

    if (!contenedor) return;

    // 1. Cargar autores desde JSON
    fetch("data/autores.json")
        .then((r) => {
            if (!r.ok) throw new Error("HTTP " + r.status);
            return r.json();
        })
        .then((autores) => {
            renderAutores(Array.isArray(autores) ? autores : []);
        })
        .catch((err) => {
            console.error("Error al cargar autores.json:", err);
            contenedor.innerHTML =
                '<div class="text-sm text-red-600 col-span-full text-center">No se pudo cargar la información de autores.</div>';
        });

    function renderAutores(autores) {
        contenedor.innerHTML = "";

        if (!autores.length) {
            contenedor.innerHTML =
                '<div class="text-sm text-slate-500 col-span-full text-center">No hay autores registrados.</div>';
            return;
        }

        autores.forEach((autor) => {
            const imgSrc =
                autor.foto && autor.foto.trim() !== ""
                    ? autor.foto
                    : "https://via.placeholder.com/200x200?text=Autor";

            const card = document.createElement("article");
            card.className =
                "autor-card bg-slate-100 rounded-3xl px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row items-center gap-4";

            card.innerHTML = `
        <div class="flex-shrink-0">
          <img src="${imgSrc}" alt="Foto de ${autor.nombre}" class="autor-avatar">
        </div>
        <div class="autor-card-body text-center md:text-left">
          <p class="font-semibold text-slate-900 text-sm md:text-base">${autor.nombre}</p>
          <p class="text-[11px] md:text-xs text-slate-700">
            ${autor.rol ?? "Estudiante de Ingeniería del Software"}
          </p>
          ${autor.cedula
                    ? `<p class="text-[11px] md:text-xs text-slate-700">Cédula: ${autor.cedula}</p>`
                    : ""
                }
          <p class="text-[11px] md:text-xs text-slate-700 mt-1">
            Correo:
            <a href="mailto:${autor.correo}" class="text-sky-700 hover:underline">
              ${autor.correo}
            </a>
          </p>
          ${autor.descripcion
                    ? `<p class="text-[11px] md:text-xs text-slate-600 mt-2">${autor.descripcion}</p>`
                    : ""
                }
        </div>
      `;

            contenedor.appendChild(card);
        });
    }

    // 2. Botón "Resaltar autores"
    if (btnResaltar) {
        btnResaltar.addEventListener("click", () => {
            const tarjetas = document.querySelectorAll(".autor-card");
            tarjetas.forEach((t) => t.classList.toggle("autor-card--highlight"));

            const hayResaltados = document.querySelector(
                ".autor-card.autor-card--highlight"
            );
            btnResaltar.textContent = hayResaltados
                ? "Quitar resaltado"
                : "Resaltar autores";
        });
    }
});


