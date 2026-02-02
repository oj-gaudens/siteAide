const textarea = document.getElementById("markdown-input");
const preview = document.getElementById("preview");
const templateSelector = document.getElementById("template-selector");
const themeSelector = document.getElementById("theme-selector");
const toolbar = document.querySelector(".toolbar");

// Buttons
const btnCopyHTML = document.getElementById("copy-html");
const btnCopyText = document.getElementById("copy-text");
const btnDownloadHTML = document.getElementById("download-html");
const btnExportPDF = document.getElementById("export-pdf");
const btnClear = document.getElementById("clear-all");
const btnFullscreen = document.getElementById("fullscreen");

// Slide state
let currentSlide = 0;

// Demo tips
const demos = {
  site: "💡 Template Site : header/footer/sections principales.",
  email: "💡 Template Email : objet/contenu/footer avec inline CSS.",
  slides: "💡 Template Slides : séparer les slides avec '---'. Utilisez flèches ← →."
};

// Update preview
function updatePreview() {
  let md = textarea.value;
  preview.innerHTML = marked.parse(md);

  // Show demo tips
  const tip = demos[templateSelector.value];
  if(tip) {
    const box = document.createElement("div");
    box.className="demo-box";
    box.textContent = tip;
    preview.prepend(box);
  }

  // Slides
  if(templateSelector.value === "slides") {
    const rawSlides = md.split(/---/).map(s=>s.trim()).filter(Boolean);
    preview.innerHTML = "";
    rawSlides.forEach((s,i)=>{
      const div = document.createElement("div");
      div.className="slide"+(i===currentSlide?" current":"");
      div.innerHTML = marked.parse(s)+`<div class="slide-note">Notes slide ${i+1}</div>`;
      preview.appendChild(div);
    });
    // TOC
    const toc = document.createElement("div");
    toc.className="toc";
    toc.textContent = `Slide ${currentSlide+1} / ${rawSlides.length}`;
    preview.prepend(toc);
  }
}

// Event listeners
textarea.addEventListener("input",updatePreview);
templateSelector.addEventListener("change",()=>{currentSlide=0;updatePreview();});
themeSelector.addEventListener("change",e=>{
  document.body.className=e.target.value;
});

// Buttons actions
btnCopyHTML.addEventListener("click",()=>{navigator.clipboard.writeText(preview.innerHTML); alert("HTML copié !");});
btnCopyText.addEventListener("click",()=>{navigator.clipboard.writeText(textarea.value); alert("Texte brut copié !");});
btnDownloadHTML.addEventListener("click",()=>{
  const blob=new Blob([preview.innerHTML],{type:"text/html"});
  const link=document.createElement("a"); link.href=URL.createObjectURL(blob); link.download="export.html"; link.click();
});
btnExportPDF.addEventListener("click",()=>{ const pdfWindow=window.open("","_blank"); pdfWindow.document.write("<html><body>"+preview.innerHTML+"</body></html>"); pdfWindow.document.close(); pdfWindow.print();});
btnClear.addEventListener("click",()=>{textarea.value=""; updatePreview();});
btnFullscreen.addEventListener("click",()=>{document.body.requestFullscreen();});

// Slides navigation
document.addEventListener("keydown",(e)=>{
  if(templateSelector.value==="slides"){
    const slides = document.querySelectorAll(".slide");
    slides[currentSlide].classList.remove("current");
    if(e.key==="ArrowRight") currentSlide=(currentSlide+1)%slides.length;
    if(e.key==="ArrowLeft") currentSlide=(currentSlide-1+slides.length)%slides.length;
    slides[currentSlide].classList.add("current");
    const toc=document.querySelector(".toc");
    if(toc) toc.textContent=`Slide ${currentSlide+1} / ${slides.length}`;
  }
});

// Init
updatePreview();

