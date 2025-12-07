document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formRiesgo");
    if (!form) return;

    const nivelEl = document.getElementById("riesgoNivel");
    const barEl = document.getElementById("riesgoBar");
    const porcentajeEl = document.getElementById("riesgoPorcentaje");
    const mensajeEl = document.getElementById("riesgoMensaje");
    const listaEl = document.getElementById("riesgoLista");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Leer valores del formulario
        const tipoBeca = document.getElementById("tipoBeca").value;
        const promedio = Number(document.getElementById("promedio").value) || 0;
        const cursosReprobados = Number(document.getElementById("cursosReprobados").value) || 0;
        const creditosMatriculados = Number(document.getElementById("creditosMatriculados").value) || 0;
        const creditosAprobados = Number(document.getElementById("creditosAprobados").value) || 0;
        const documentos = document.getElementById("documentos").value;
        const horasTrabajo = document.getElementById("horasTrabajo").value;
        const retiros = document.getElementById("retiros").value;

        // Validación mínima
        if (!tipoBeca) {
            alert("Seleccioná el tipo de beca.");
            return;
        }

        if (!promedio || promedio < 0 || promedio > 100) {
            alert("Indicá tu promedio ponderado (0 a 100).");
            return;
        }

        if (!documentos || !horasTrabajo || !retiros) {
            alert("Completá todas las opciones de selección (documentos, trabajo, retiros).");
            return;
        }

        // Calcular puntaje de riesgo (0 = bajo, 100 = muy alto)
        const resultado = calcularRiesgo({
            tipoBeca,
            promedio,
            cursosReprobados,
            creditosMatriculados,
            creditosAprobados,
            documentos,
            horasTrabajo,
            retiros,
        });

        // Actualizar UI
        actualizarResultado(resultado);
    });

    function calcularRiesgo(datos) {
        let score = 0;
        const recomendaciones = [];

        // 1. Promedio
        if (datos.promedio < 70) {
            score += 40;
            recomendaciones.push("Buscar apoyo académico para subir el promedio por encima del mínimo requerido.");
        } else if (datos.promedio < 80) {
            score += 25;
            recomendaciones.push("Intentar subir el promedio para tener un margen más seguro.");
        } else if (datos.promedio < 90) {
            score += 10;
        }

        // 2. Cursos reprobados
        if (datos.cursosReprobados >= 3) {
            score += 25;
            recomendaciones.push("Reducir el número de reprobaciones; podrías estar cerca del límite que afecta la beca.");
        } else if (datos.cursosReprobados === 2) {
            score += 15;
            recomendaciones.push("Cuida no seguir acumulando cursos reprobados en el siguiente ciclo.");
        } else if (datos.cursosReprobados === 1) {
            score += 8;
        }

        // 3. Relación créditos aprobados / matriculados anteriores (si tiene sentido)
        if (datos.creditosMatriculados > 0 && datos.creditosAprobados > 0) {
            const ratio = datos.creditosAprobados / datos.creditosMatriculados;

            if (ratio < 0.6) {
                score += 20;
                recomendaciones.push("Revisar la carga académica y priorizar aprobar la mayoría de los cursos matriculados.");
            } else if (ratio < 0.8) {
                score += 10;
            }
        }

        // 4. Carga actual muy baja (ejemplo: menos de 12 créditos)
        if (datos.creditosMatriculados > 0 && datos.creditosMatriculados < 12) {
            score += 10;
            recomendaciones.push("Verificar si la beca exige una carga mínima de créditos por ciclo.");
        }

        // 5. Documentos
        if (datos.documentos === "no") {
            score += 25;
            recomendaciones.push("Regularizar cuanto antes la entrega de documentos y constancias requeridas.");
        }

        // 6. Trabajo
        if (datos.horasTrabajo === "20a36") {
            score += 8;
            recomendaciones.push("Organizar muy bien el tiempo de estudio para que el trabajo no afecte el rendimiento.");
        } else if (datos.horasTrabajo === "mas36") {
            score += 15;
            recomendaciones.push("Muchas horas de trabajo pueden afectar notas y carga académica; valorar ajustes.");
        }

        // 7. Retiros
        if (datos.retiros === "1") {
            score += 8;
            recomendaciones.push("Evitar nuevos retiros y planear mejor la carga de cursos.");
        } else if (datos.retiros === "2") {
            score += 15;
            recomendaciones.push("Varios retiros pueden interpretarse como inestabilidad en el avance de la carrera.");
        } else if (datos.retiros === "3plus") {
            score += 22;
            recomendaciones.push("Un número alto de retiros puede poner en riesgo la beca; consultar con vida estudiantil.");
        }

        // 8. Ajustes según tipo de beca
        if (datos.tipoBeca === "socioeconomica" && datos.documentos === "no") {
            score += 5; // un poquito más sensible a documentos
        }
        if (datos.tipoBeca === "academica" && datos.promedio < 85) {
            score += 10; // beca académica es más exigente con promedio
        }

        // Limitar score a 0–100
        score = Math.max(0, Math.min(score, 100));

        // Nivel de riesgo
        let nivel = "";
        let mensajeNivel = "";

        if (score <= 30) {
            nivel = "Bajo";
            mensajeNivel = "Tu situación actual es relativamente segura, pero es importante mantener el rendimiento y los requisitos al día.";
        } else if (score <= 60) {
            nivel = "Medio";
            mensajeNivel = "Hay varios factores que podrían afectar tu beca si no se corrigen a tiempo.";
        } else {
            nivel = "Alto";
            mensajeNivel = "La beca podría estar en riesgo. Es recomendable buscar acompañamiento académico y revisar los criterios del reglamento.";
        }

        return {
            score,
            nivel,
            mensajeNivel,
            recomendaciones,
        };
    }

    function actualizarResultado({ score, nivel, mensajeNivel, recomendaciones }) {
        // Texto de nivel
        nivelEl.textContent = `Riesgo ${nivel}`;
        nivelEl.classList.remove("riesgo-bajo", "riesgo-medio", "riesgo-alto");

        // Clase según nivel (para color del texto)
        if (nivel === "Bajo") {
            nivelEl.classList.add("riesgo-bajo");
        } else if (nivel === "Medio") {
            nivelEl.classList.add("riesgo-medio");
        } else {
            nivelEl.classList.add("riesgo-alto");
        }

        // Barra
        barEl.style.width = `${score}%`;
        barEl.classList.remove("riesgo-bar-bajo", "riesgo-bar-medio", "riesgo-bar-alto");

        if (nivel === "Bajo") {
            barEl.classList.add("riesgo-bar-bajo");
        } else if (nivel === "Medio") {
            barEl.classList.add("riesgo-bar-medio");
        } else {
            barEl.classList.add("riesgo-bar-alto");
        }

        porcentajeEl.textContent = `${score}%`;
        mensajeEl.textContent = mensajeNivel;

        // Lista de recomendaciones
        listaEl.innerHTML = "";

        if (!recomendaciones.length) {
            const li = document.createElement("li");
            li.textContent = "Seguí cumpliendo con la carga académica y los requisitos de la beca.";
            listaEl.appendChild(li);
        } else {
            recomendaciones.forEach((texto) => {
                const li = document.createElement("li");
                li.textContent = texto;
                listaEl.appendChild(li);
            });
        }
    }
});
