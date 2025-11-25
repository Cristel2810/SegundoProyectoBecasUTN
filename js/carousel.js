let index = 0;
const slides = document.querySelectorAll(".carousel-slide");

function showSlide(i) {
    slides.forEach((slide, idx) => {
        slide.style.opacity = idx === i ? "1" : "0";
    });
}

document.getElementById("nextBtn").addEventListener("click", () => {
    index = (index + 1) % slides.length;
    showSlide(index);
});

document.getElementById("prevBtn").addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
});

setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
}, 5000);
