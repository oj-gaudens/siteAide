const textarea = document.getElementById("markdown-input");
const preview = document.getElementById("preview");
const template = document.getElementById("template-selector");
const theme = document.getElementById("theme-selector");

let currentSlide = 0;

// Petits messages d’aide selon template
const demos = {
  site: "💡 Template Site : header / sections principales / footer.",
  email: "💡 Template Email : objet / contenu / footer avec styles inline.",
  slides: "💡 Slides : sépare avec ---  •  utilise ← → pour naviguer."
};

function render() {
  const md = textarea.value;

  // ===== MODE SLIDES =====
  if (template.value === "slides") {
    const slides = md.split(/---/).map(s => s.trim()).filter(Boolean);
    preview.innerHTML = "";

    slides.forEach((s, i) => {
      const div = document.createElement("div");
      div.className = "slide" + (i === currentSlide ? " current" : "");
      div.innerHTML =
        marked.parse(s) +
        `<div class="slide-note">Notes slide ${i + 1}</div>`;
      preview.appendChild(div);
    });

    // Compteur de slides
    const toc = document.createElement("div");
    toc.className = "toc";
    toc.textContent = `Slide ${currentSlide + 1} / ${slides.length}`;
    preview.prepend(toc);
  }

  // ===== AUTRES TEMPLATES =====
  else {
    preview.innerHTML = marked.parse(md);

    // Message d’aide
    if (demos[template.value]) {
      const box = document.createElement("div");
      box.className = "demo-box";
      box.textContent = demos[template.value];
      preview.prepend(box);
    }
  }
}

// ===== LIVE PREVIEW GAUCHE → DROITE =====
textarea.addEventListener("input", render);

template.addEventListener("change", () => {
  currentSlide = 0;
  render();
});

theme.addEventListener("change", e => {
  document.body.className = e.target.value;
});

// ===== BOUTONS =====
document.getElementById("copy-html").onclick = () => {
  navigator.clipboard.writeText(preview.innerHTML);
  alert("HTML copié !");
};

document.getElementById("copy-text").onclick = () => {
  navigator.clipboard.writeText(textarea.value);
  alert("Texte copié !");
};

document.getElementById("download-html").onclick = () => {
  const blob = new Blob([preview.innerHTML], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "export.html";
  a.click();
};

document.getElementById("export-pdf").onclick = () => window.print();

document.getElementById("clear-all").onclick = () => {
  textarea.value = "";
  render();
};

document.getElementById("fullscreen").onclick = () =>
  document.body.requestFullscreen();

// ===== NAVIGATION SLIDES CLAVIER =====
document.addEventListener("keydown", e => {
  if (template.value !== "slides") return;

  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  slides[currentSlide].classList.remove("current");

  if (e.key === "ArrowRight")
    currentSlide = (currentSlide + 1) % slides.length;

  if (e.key === "ArrowLeft")
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;

  slides[currentSlide].classList.add("current");

  const toc = document.querySelector(".toc");
  if (toc) toc.textContent = `Slide ${currentSlide + 1} / ${slides.length}`;
});

// Init
render();
