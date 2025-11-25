document.addEventListener("DOMContentLoaded", () => {
    initHeroSlider();
    initHomeCards();
});

/* ================= HERO SLIDER ================= */
function initHeroSlider() {
    const slides = document.querySelectorAll(".hero-slide");
    if (!slides.length) return;

    const dots = document.querySelectorAll(".hero-dot");
    const prev = document.getElementById("heroPrev");
    const next = document.getElementById("heroNext");

    let current = 0;
    let intervaloId = null;

    function goTo(index) {
        const total = slides.length;
        current = (index + total) % total;

        slides.forEach((s, i) =>
            s.classList.toggle("hero-slide--active", i === current)
        );
        dots.forEach((d, i) =>
            d.classList.toggle("hero-dot--active", i === current)
        );
    }

    function siguiente() {
        goTo(current + 1);
    }

    prev?.addEventListener("click", () => {
        goTo(current - 1);
        reiniciarAuto();
    });

    next?.addEventListener("click", () => {
        goTo(current + 1);
        reiniciarAuto();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            goTo(i);
            reiniciarAuto();
        });
    });

    function iniciarAuto() {
        intervaloId = setInterval(siguiente, 7000);
    }

    function reiniciarAuto() {
        if (intervaloId) clearInterval(intervaloId);
        iniciarAuto();
    }

    goTo(0);
    iniciarAuto();
}

/* ================= TARJETAS DINÁMICAS HOME ================= */
function initHomeCards() {
    const cardsContainer = document.getElementById("cardsContainer");
    const filterButtons = document.querySelectorAll("[data-filter]");
    if (!cardsContainer) return;

    let tarjetas = [];

    fetch("data/home-cards.json")
        .then((resp) => {
            if (!resp.ok) throw new Error("Error HTTP " + resp.status);
            return resp.json();
        })
        .then((data) => {
            tarjetas = Array.isArray(data) ? data : [];
            renderTarjetas("todos");
        })
        .catch((error) => {
            console.error("No se pudo cargar home-cards.json:", error);
            cardsContainer.innerHTML =
                '<div class="text-sm text-red-600 col-span-full">Error al cargar la información.</div>';
        });

    function renderTarjetas(filtro) {
        cardsContainer.innerHTML = "";

        const items = tarjetas.filter((t) =>
            filtro === "todos" ? true : t.tipo === filtro
        );

        if (!items.length) {
            cardsContainer.innerHTML =
                '<div class="text-sm text-slate-500 col-span-full">No hay elementos para este filtro.</div>';
            return;
        }

        items.forEach((item) => {
            const card = document.createElement("article");
            card.className = "json-card";

            const header = document.createElement("div");
            header.className =
                "json-card-header " +
                (item.tipo === "problema"
                    ? "json-card-header--problema"
                    : "json-card-header--solucion");
            header.textContent =
                item.tipo === "problema"
                    ? "Dificultad detectada"
                    : "Cómo ayuda el portal";

            const title = document.createElement("h3");
            title.className = "json-card-title";
            title.textContent = item.titulo;

            const body = document.createElement("div");
            body.className = "json-card-body";
            body.textContent = item.descripcionCorta;

            const extra = document.createElement("p");
            extra.className = "json-extra";
            extra.textContent = item.detalle;

            const footer = document.createElement("div");
            footer.className = "json-card-footer";

            const chip = document.createElement("span");
            chip.className =
                "json-chip " +
                (item.tipo === "problema"
                    ? "bg-red-50 text-red-700"
                    : "bg-emerald-50 text-emerald-700");
            chip.textContent = item.tipo === "problema" ? "Problema" : "Solución";

            const btnDetalle = document.createElement("button");
            btnDetalle.type = "button";
            btnDetalle.className = "json-btn-detalle";
            btnDetalle.textContent = "Ver detalle";

            btnDetalle.addEventListener("click", () => {
                card.classList.toggle("open");
                btnDetalle.textContent = card.classList.contains("open")
                    ? "Ocultar detalle"
                    : "Ver detalle";
            });

            footer.appendChild(chip);
            footer.appendChild(btnDetalle);

            card.appendChild(header);
            card.appendChild(title);
            card.appendChild(body);
            card.appendChild(extra);
            card.appendChild(footer);

            cardsContainer.appendChild(card);
        });
    }

    // filtros
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const filtro = btn.getAttribute("data-filter");
            filterButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            renderTarjetas(filtro);
        });
    });

    // scroll suave desde hero
    const introSection = document.getElementById("intro");
    const btnVerPropuesta = document.getElementById("btnVerPropuesta");
    const btnScrollProblema = document.getElementById("btnScrollProblema");
    const btnScrollProblema2 = document.getElementById("btnScrollProblema2");

    function scrollSuaveIntro() {
        if (!introSection) return;
        introSection.scrollIntoView({ behavior: "smooth" });
    }

    btnVerPropuesta?.addEventListener("click", scrollSuaveIntro);
    btnScrollProblema?.addEventListener("click", scrollSuaveIntro);
    btnScrollProblema2?.addEventListener("click", scrollSuaveIntro);
}

