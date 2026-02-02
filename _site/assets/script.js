document.addEventListener("DOMContentLoaded", () => {

/* ===== CONFIG MARKED ===== */
marked.setOptions({
  gfm: true,
  breaks: true
});

const textarea = document.getElementById("markdown-input");
const preview = document.getElementById("preview");
const templateSelector = document.getElementById("template-selector");
const themeSelector = document.getElementById("theme-selector");

// Buttons
const btnCopyHTML = document.getElementById("copy-html");
const btnCopyText = document.getElementById("copy-text");
const btnDownloadHTML = document.getElementById("download-html");
const btnExportPDF = document.getElementById("export-pdf");
const btnClear = document.getElementById("clear-all");
const btnFullscreen = document.getElementById("fullscreen");

let currentSlide = 0;

/* ======================================
   🔥 PARSER BLOCS CUSTOM DSFR (SAFE)
======================================*/
function parseCustomBlocks(md) {
  let blocks = [];

  md = md.replace(
    /\/\/\/\s*alert\s*\|\s*(.*?)\s*\r?\n([\s\S]*?)\r?\n\/\/\//g,
    (match, title, content) => {
      const html = `
<div class="fr-alert fr-alert--info">
  <h5 class="fr-alert__title">${title.trim()}</h5>
  ${marked.parse(content.trim())}
</div>`;
      blocks.push(html);
      return `%%ALERT_BLOCK_${blocks.length - 1}%%`;
    }
  );

  return { md, blocks };
}

const demos = {
  site: "💡 Template Site : header/footer/sections principales.",
  email: "💡 Template Email : objet/contenu/footer avec inline CSS.",
  slides: "💡 Slides : séparer avec ---  •  utiliser ← →"
};

function updatePreview() {
  let raw = textarea.value;

  // 🔥 On extrait les blocs custom
  const parsed = parseCustomBlocks(raw);
  let md = parsed.md;

  /* ===== MODE SLIDES ===== */
  if (templateSelector.value === "slides") {
    const slides = md.split(/---/).map(s => s.trim()).filter(Boolean);
    preview.innerHTML = "";

    slides.forEach((s, i) => {
      const div = document.createElement("div");
      div.className = "slide" + (i === currentSlide ? " current" : "");

      let slideHTML = marked.parse(s);

      parsed.blocks.forEach((block, idx) => {
        slideHTML = slideHTML.replace(`%%ALERT_BLOCK_${idx}%%`, block);
      });

      div.innerHTML = slideHTML + `<div class="slide-note">Notes slide ${i + 1}</div>`;
      preview.appendChild(div);
    });

    const toc = document.createElement("div");
    toc.className = "toc";
    toc.textContent = `Slide ${currentSlide + 1} / ${slides.length}`;
    preview.prepend(toc);
  }

  /* ===== MODE NORMAL ===== */
  else {
    let html = marked.parse(md);

    parsed.blocks.forEach((block, i) => {
      html = html.replace(`%%ALERT_BLOCK_${i}%%`, block);
    });

    preview.innerHTML = html;

    if (demos[templateSelector.value]) {
      const box = document.createElement("div");
      box.className = "demo-box";
      box.textContent = demos[templateSelector.value];
      preview.prepend(box);
    }
  }
}

/* ===== LIVE PREVIEW ===== */
textarea.addEventListener("input", updatePreview);

templateSelector.addEventListener("change", () => {
  currentSlide = 0;
  updatePreview();
});

themeSelector.addEventListener("change", e => {
  document.body.className = e.target.value;
});

/* ===== BOUTONS ===== */
btnCopyHTML.onclick = () => {
  navigator.clipboard.writeText(preview.innerHTML);
  alert("HTML copié !");
};

btnCopyText.onclick = () => {
  navigator.clipboard.writeText(textarea.value);
  alert("Texte copié !");
};

btnDownloadHTML.onclick = () => {
  const blob = new Blob([preview.innerHTML], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "export.html";
  a.click();
};

btnExportPDF.onclick = () => window.print();

btnClear.onclick = () => {
  textarea.value = "";
  updatePreview();
};

btnFullscreen.onclick = () => document.body.requestFullscreen();

/* ===== NAVIGATION SLIDES ===== */
document.addEventListener("keydown", e => {
  if (templateSelector.value !== "slides") return;

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

/* ===== INIT ===== */
updatePreview();

});
