// ============================================================================
// MARKDOWN EDITOR DSFR - Script principal
// ============================================================================

// ATTENDRE QUE LE DOM SOIT CHARGÉ
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initialisation du Studio Markdown DSFR...');

  // ============================================================================
  // ELEMENTS DU DOM
  // ============================================================================
  
  const textarea = document.getElementById("markdown-input");
  const preview = document.getElementById("preview");

  if (!textarea || !preview) {
    console.error('❌ Erreur: Éléments introuvables');
    return;
  }

  console.log('✅ Éléments trouvés');

  let currentSlide = 0;
  let currentMode = 'normal'; // 'normal' ou 'slides'

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  function generateId(text) {
    return text.toLowerCase()
      .replace(/[àâä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o')
      .replace(/[ùûü]/g, 'u')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function parseOptions(optionsText) {
    const options = {};
    if (!optionsText) return options;
    
    const lines = optionsText.trim().split('\n');
    lines.forEach(line => {
      const match = line.match(/^\s*(\w+):\s*(.+)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        options[key] = value;
      }
    });
    
    return options;
  }

  // ============================================================================
  // COMPOSANTS DSFR - Traitement
  // ============================================================================

  function processAlerts(md) {
    const regex = /\/\/\/\s*alert\s*\|\s*([^\n]+)\n([\s\S]*?)\/\/\//g;
    
    return md.replace(regex, (match, title, content) => {
      const lines = content.trim().split('\n');
      const optionLines = [];
      const contentLines = [];
      
      lines.forEach(line => {
        if (line.match(/^\s*\w+:/)) {
          optionLines.push(line);
        } else {
          contentLines.push(line);
        }
      });
      
      const options = parseOptions(optionLines.join('\n'));
      const actualContent = contentLines.join('\n').trim();
      
      const type = options.type || 'info';
      const markup = options.markup || 'h5';
      const titleHtml = `<${markup} class="fr-alert__title">${title.trim()}</${markup}>`;
      const contentHtml = marked.parse(actualContent);
      
      return `<div class="fr-alert fr-alert--${type}">
        ${titleHtml}
        ${contentHtml}
      </div>`;
    });
  }

  function processCallouts(md) {
    const regex = /\/\/\/\s*callout\s*\|\s*([^\n]+)\n([\s\S]*?)\/\/\//g;
    
    return md.replace(regex, (match, title, content) => {
      const lines = content.trim().split('\n');
      const optionLines = [];
      const contentLines = [];
      
      lines.forEach(line => {
        if (line.match(/^\s*\w+:/)) {
          optionLines.push(line);
        } else {
          contentLines.push(line);
        }
      });
      
      const options = parseOptions(optionLines.join('\n'));
      const actualContent = contentLines.join('\n').trim();
      
      const color = options.color || 'blue-cumulus';
      const icon = options.icon || '';
      const markup = options.markup || 'h3';
      const linkLabel = options.link_label || '';
      const linkUrl = options.link_url || '';
      const linkNewtab = options.link_newtab || false;
      
      const iconHtml = icon ? `<span class="fr-icon-${icon}" aria-hidden="true"></span>` : '';
      const titleHtml = `<${markup} class="fr-callout__title">${iconHtml} ${title.trim()}</${markup}>`;
      const contentHtml = marked.parse(actualContent);
      
      let buttonHtml = '';
      if (linkLabel && linkUrl) {
        const target = linkNewtab ? ' target="_blank" rel="noopener"' : '';
        buttonHtml = `<a class="fr-btn" href="${linkUrl}"${target}>${linkLabel}</a>`;
      }
      
      return `<div class="fr-callout fr-fi-information-line fr-callout--${color}">
        ${titleHtml}
        ${contentHtml}
        ${buttonHtml}
      </div>`;
    });
  }

  function processBadges(md) {
    const regex = /\/\/\/\s*badge\s*\n([\s\S]*?)\/\/\//g;
    
    return md.replace(regex, (match, content) => {
      const lines = content.trim().split('\n');
      const optionLines = [];
      const textLines = [];
      
      lines.forEach(line => {
        if (line.match(/^\s*\w+:/)) {
          optionLines.push(line);
        } else {
          textLines.push(line);
        }
      });
      
      const options = parseOptions(optionLines.join('\n'));
      const text = textLines.join(' ').trim();
      
      const type = options.type || '';
      const color = options.color || '';
      const icon = options.icon === true || options.icon === 'true';
      
      let classes = 'fr-badge';
      if (type) classes += ` fr-badge--${type}`;
      if (color) classes += ` fr-badge--${color}`;
      if (icon) classes += ' fr-badge--icon';
      
      return `<span class="${classes}">${text}</span>`;
    });
  }

  function processCards(md) {
    const regex = /\/\/\/\s*card\s*\|\s*([^\n]+)\n([\s\S]*?)\/\/\//g;
    
    return md.replace(regex, (match, title, content) => {
      const lines = content.trim().split('\n');
      const optionLines = [];
      const contentLines = [];
      
      lines.forEach(line => {
        if (line.match(/^\s*\w+:/)) {
          optionLines.push(line);
        } else {
          contentLines.push(line);
        }
      });
      
      const options = parseOptions(optionLines.join('\n'));
      const actualContent = contentLines.join('\n').trim();
      
      const image = options.image || '';
      const target = options.target || '#';
      const badge = options.badge || '';
      const markup = options.markup || 'h4';
      
      const imageHtml = image ? `<div class="fr-card__img"><img src="${image}" class="fr-responsive-img" alt=""></div>` : '';
      
      let badgeHtml = '';
      if (badge) {
        const [badgeText, badgeColor] = badge.split('|').map(s => s.trim());
        badgeHtml = `<p class="fr-badge fr-badge--sm fr-badge--${badgeColor || 'info'}">${badgeText}</p>`;
      }
      
      const titleHtml = `<${markup} class="fr-card__title"><a href="${target}" class="fr-card__link">${title.trim()}</a></${markup}>`;
      const contentHtml = `<p class="fr-card__desc">${actualContent}</p>`;
      
      return `<div class="fr-card fr-enlarge-link">
        ${imageHtml}
        <div class="fr-card__body">
          <div class="fr-card__content">
            ${badgeHtml}
            ${titleHtml}
            ${contentHtml}
          </div>
        </div>
      </div>`;
    });
  }

  function processTiles(md) {
    const regex = /\/\/\/\s*tile\s*\|\s*([^\n]+)\n([\s\S]*?)\/\/\//g;
    
    return md.replace(regex, (match, title, content) => {
      const lines = content.trim().split('\n');
      const optionLines = [];
      const contentLines = [];
      
      lines.forEach(line => {
        if (line.match(/^\s*\w+:/)) {
          optionLines.push(line);
        } else {
          contentLines.push(line);
        }
      });
      
      const options = parseOptions(optionLines.join('\n'));
      const actualContent = contentLines.join('\n').trim();
      
      const picto = options.picto || '';
      const target = options.target || '#';
      const badge = options.badge || '';
      const markup = options.markup || 'h4';
      
      const pictoHtml = picto ? `<div class="fr-tile__img"><img src="/assets/icons/${picto}.svg" alt=""></div>` : '';
      
      let badgeHtml = '';
      if (badge) {
        const [badgeText, badgeColor] = badge.split('|').map(s => s.trim());
        badgeHtml = `<p class="fr-badge fr-badge--sm fr-badge--${badgeColor || 'info'}">${badgeText}</p>`;
      }
      
      const titleHtml = `<${markup} class="fr-tile__title"><a href="${target}" class="fr-tile__link">${title.trim()}</a></${markup}>`;
      const contentHtml = `<p class="fr-tile__desc">${actualContent}</p>`;
      
      return `<div class="fr-tile fr-enlarge-link">
        <div class="fr-tile__body">
          ${badgeHtml}
          ${titleHtml}
          ${contentHtml}
        </div>
        ${pictoHtml}
      </div>`;
    });
  }

  function processAccordions(md) {
    const regex = /\/\/\/\s*accordion\s*\|\s*([^\n]+)\n([\s\S]*?)\/\/\//g;
    
    return md.replace(regex, (match, title, content) => {
      const lines = content.trim().split('\n');
      const optionLines = [];
      const contentLines = [];
      
      lines.forEach(line => {
        if (line.match(/^\s*\w+:/)) {
          optionLines.push(line);
        } else {
          contentLines.push(line);
        }
      });
      
      const options = parseOptions(optionLines.join('\n'));
      const actualContent = contentLines.join('\n').trim();
      
      const open = options.open === true || options.open === 'true';
      const id = generateId(title);
      
      const contentHtml = marked.parse(actualContent);
      
      return `<section class="fr-accordion">
        <h3 class="fr-accordion__title">
          <button class="fr-accordion__btn" aria-expanded="${open}" aria-controls="${id}">${title.trim()}</button>
        </h3>
        <div class="fr-collapse" id="${id}" ${open ? '' : 'style="display:none;"'}>
          ${contentHtml}
        </div>
      </section>`;
    });
  }

  function processGrids(md) {
    // Traiter les rows et cols
    let result = md;
    
    // Remplacer les rows
    result = result.replace(/\/\/\/\s*row\s*\|\s*([^\n]*)\n/g, (match, classes) => {
      return `<div class="fr-grid-row ${classes.trim()}">`;
    });
    
    // Remplacer les cols
    result = result.replace(/\/\/\/\s*col\s*\|\s*([^\n]*)\n/g, (match, classes) => {
      const colClasses = classes.trim().split(/\s+/).map(c => `fr-col-${c}`).join(' ');
      return `<div class="${colClasses}">`;
    });
    
    // Remplacer les cols simples
    result = result.replace(/\/\/\/\s*col\s*\n/g, '<div class="fr-col">');
    
    // Fermer les divs
    result = result.replace(/\/\/\/\s*\n/g, '</div>\n');
    
    return result;
  }

  function processAllComponents(md) {
    let result = md;
    result = processAlerts(result);
    result = processCallouts(result);
    result = processBadges(result);
    result = processAccordions(result);
    result = processCards(result);
    result = processTiles(result);
    result = processGrids(result);
    return result;
  }

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================

  function render() {
    const md = textarea.value;

    // Détecter si c'est du mode slides
    if (md.includes('---')) {
      currentMode = 'slides';
      renderSlides(md);
    } else {
      currentMode = 'normal';
      renderNormal(md);
    }
  }

  function renderNormal(md) {
    const processedMd = processAllComponents(md);
    preview.innerHTML = marked.parse(processedMd);
    console.log('✅ Preview mise à jour (mode normal)');
  }

  function renderSlides(md) {
    const slides = md.split("---").map(s => s.trim()).filter(Boolean);
    preview.innerHTML = "";
    
    slides.forEach((slideContent, index) => {
      const div = document.createElement("div");
      div.className = "slide" + (index === currentSlide ? " current" : "");
      const processedContent = processAllComponents(slideContent);
      div.innerHTML = marked.parse(processedContent);
      div.addEventListener("click", () => {
        currentSlide = index;
        updateSlides();
      });
      preview.appendChild(div);
    });
    
    console.log(`✅ Preview mise à jour (${slides.length} slides)`);
  }

  function updateSlides() {
    const slides = document.querySelectorAll(".slide");
    slides.forEach((slide, index) => {
      slide.classList.toggle("current", index === currentSlide);
    });
  }

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================

  function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
      notif.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => notif.remove(), 300);
    }, 2000);
  }

  // ============================================================================
  // EVENT LISTENERS - Textarea
  // ============================================================================

  textarea.addEventListener("input", () => {
    render();
  });

  // ============================================================================
  // EVENT LISTENERS - Boutons Templates (dans le menu)
  // ============================================================================

  const templates = {
    site: `# Bienvenue sur mon site

## À propos

Ceci est un site web créé avec le Système de Design de l'État.

### Nos services

- Service 1
- Service 2
- Service 3

## Contact

Pour nous contacter : [contact@exemple.gouv.fr](mailto:contact@exemple.gouv.fr)

/// alert | Information importante
type: info
markup: h4
Ceci est une information importante.
///`,

    email: `# Objet : Votre demande

Bonjour,

Nous accusons réception de votre demande.

/// alert | Information
type: info
Votre dossier est en cours de traitement.
///

## Prochaines étapes

1. Vérification des documents
2. Validation
3. Réponse finale

Cordialement,

L'équipe`,

    slides: `---

# 🎯 Titre de la présentation

**Sous-titre élégant**

---

## 📋 Plan de la présentation

/// card
**Points clés :**
- 📌 Point important 1
- 📌 Point important 2  
- 📌 Point important 3
///

---

## 💡 Slide avec cadre

/// alert | Information importante
type: info
markup: h4
Ceci est un contenu mis en valeur dans un cadre bleu
///

**Détails supplémentaires** avec du texte normal

---

## 📊 Conclusion

**Merci de votre attention !**

/// alert | À retenir
type: success
Les points essentiels à retenir de cette présentation
///`
  };

  document.getElementById('nav-template-site')?.addEventListener('click', () => {
    textarea.value = templates.site;
    render();
    showNotification('Template Site chargé ! 🌐');
  });

  document.getElementById('nav-template-email')?.addEventListener('click', () => {
    textarea.value = templates.email;
    render();
    showNotification('Template Email chargé ! ✉️');
  });

  document.getElementById('nav-template-slides')?.addEventListener('click', () => {
    textarea.value = templates.slides;
    render();
    showNotification('Template Slides chargé ! 📊');
  });

  // ============================================================================
  // EVENT LISTENERS - Boutons de la toolbar
  // ============================================================================

  // Copier HTML
  document.getElementById("copy-html")?.addEventListener('click', () => {
    navigator.clipboard.writeText(preview.innerHTML)
      .then(() => showNotification("HTML copié ! 📋"))
      .catch(() => showNotification("Erreur de copie ❌"));
  });

  // Copier texte
  document.getElementById("copy-text")?.addEventListener('click', () => {
    navigator.clipboard.writeText(preview.textContent)
      .then(() => showNotification("Texte copié ! 📄"))
      .catch(() => showNotification("Erreur de copie ❌"));
  });

  // Télécharger HTML
  document.getElementById("download-html")?.addEventListener('click', () => {
    const blob = new Blob([preview.innerHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
    showNotification("HTML téléchargé ! 💾");
  });

  // Exporter PDF
  document.getElementById("export-pdf")?.addEventListener('click', () => {
    window.print();
    showNotification("Impression lancée ! 📑");
  });

  // Effacer
  document.getElementById("clear-all")?.addEventListener('click', () => {
    if (confirm('Êtes-vous sûr de vouloir tout effacer ?')) {
      textarea.value = '';
      render();
      localStorage.removeItem("markdown-content");
      showNotification("Contenu effacé ! 🗑️");
    }
  });

 // Clear all
document.getElementById("clear-all").onclick = () => {
  if (confirm("Voulez-vous vraiment tout effacer ?")) {
    textarea.value = "";
    render();
    showNotification("Contenu effacé");
  }
};

// Fullscreen - Vue côte-à-côte comme un vrai éditeur
document.getElementById("fullscreen").onclick = () => {
  const editorSection = document.querySelector('.editor');
  
  if (!document.fullscreenElement) {
    // Mode plein écran activé
    document.body.requestFullscreen().catch(err => {
      showNotification("Erreur plein écran", true);
    });
    
    // Appliquer le style plein écran
    editorSection.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      max-width: 100%;
      padding: 0;
      margin: 0;
      gap: 0;
      z-index: 9999;
      background: #ffffff;
    `;
    
    textarea.style.cssText = `
      width: 50%;
      height: 100vh;
      border-radius: 0;
      border: none;
      border-right: 2px solid #ddd;
      padding: 20px;
      margin: 0;
    `;
    
    preview.style.cssText = `
      width: 50%;
      height: 100vh;
      border-radius: 0;
      border: none;
      padding: 40px;
      margin: 0;
      overflow-y: auto;
    `;
    
  } else {
    // Sortir du plein écran
    document.exitFullscreen();
    
    // Restaurer les styles normaux
    editorSection.style.cssText = '';
    textarea.style.cssText = '';
    preview.style.cssText = '';
  }
};

// Restaurer les styles quand on quitte le plein écran avec Échap
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    const editorSection = document.querySelector('.editor');
    editorSection.style.cssText = '';
    textarea.style.cssText = '';
    preview.style.cssText = '';
  }
});
  // ============================================================================
  // SYSTÈME DE THÈME
  // ============================================================================

  function applyTheme(themeName) {
    const htmlElement = document.documentElement;
    
    htmlElement.classList.remove('theme-dark');
    
    if (themeName === 'dark') {
      htmlElement.classList.add('theme-dark');
    }
    
    htmlElement.setAttribute('data-fr-scheme', themeName);
    localStorage.setItem("theme", themeName);
    
    // Synchroniser les radios DSFR
    const lightRadio = document.getElementById('fr-radios-theme-light');
    const darkRadio = document.getElementById('fr-radios-theme-dark');
    
    if (lightRadio && darkRadio) {
      lightRadio.checked = (themeName === 'light');
      darkRadio.checked = (themeName === 'dark');
    }
    
    console.log(`✅ Thème ${themeName} appliqué`);
  }

  // Charger le thème sauvegardé
  const savedTheme = localStorage.getItem("theme") || 'light';
  applyTheme(savedTheme);

  // Gérer les radios DSFR dans la modale
  document.querySelectorAll('input[name="fr-radios-theme"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const theme = e.target.value;
      applyTheme(theme);
      
      if (theme === 'light') {
        showNotification('Mode clair activé ☀️');
      } else if (theme === 'dark') {
        showNotification('Mode sombre activé 🌙');
      }
    });
  });

  // ============================================================================
  // TOOLBAR COMPONENTS INSERTION
  // ============================================================================

  // Toggle dropdown menus
  document.querySelectorAll('.group-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const group = button.parentElement;
      const content = group.querySelector('.group-buttons');
      const isHidden = content.classList.contains('hidden');
      
      content.classList.toggle('hidden');
      button.textContent = button.textContent.replace(isHidden ? '▼' : '▲', isHidden ? '▲' : '▼');
    });
  });

  // Expand all / Collapse all
  document.getElementById('expand-all')?.addEventListener('click', () => {
    document.querySelectorAll('.group-buttons').forEach(content => {
      content.classList.remove('hidden');
    });
    document.querySelectorAll('.group-toggle').forEach(btn => {
      btn.textContent = btn.textContent.replace('▼', '▲');
    });
  });

  document.getElementById('collapse-all')?.addEventListener('click', () => {
    document.querySelectorAll('.group-buttons').forEach(content => {
      content.classList.add('hidden');
    });
    document.querySelectorAll('.group-toggle').forEach(btn => {
      btn.textContent = btn.textContent.replace('▲', '▼');
    });
  });

  // Insert component when button is clicked
  document.querySelectorAll('[data-insert]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const textToInsert = button.getAttribute('data-insert');
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      
      const before = text.substring(0, start);
      const after = text.substring(end);
      
      textarea.value = before + '\n' + textToInsert + '\n' + after;
      
      const newCursorPos = start + textToInsert.length + 2;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
      
      render();
      showNotification('Composant inséré ! ✨');
    });
  });

  // ============================================================================
  // SAUVEGARDE AUTOMATIQUE
  // ============================================================================

  let saveTimeout;
  textarea.addEventListener("input", () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      localStorage.setItem("markdown-content", textarea.value);
      console.log('💾 Sauvegarde automatique');
    }, 1000);
  });

  // Charger le contenu sauvegardé
  const savedContent = localStorage.getItem("markdown-content");
  if (savedContent) {
    textarea.value = savedContent;
    console.log('✅ Contenu restauré depuis localStorage');
  }

  // ============================================================================
  // RENDER INITIAL
  // ============================================================================

  render();
  console.log('✅ Initialisation terminée !');

}); // Fin du DOMContentLoaded
