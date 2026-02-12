// ============================================================================
// MARKDOWN EDITOR DSFR - Version Finale Sans Conflit
// Attend vraiment que le DSFR soit chargé via window.dsfr
// ============================================================================

// Fonction principale qui lance l'éditeur
function lancerMarkdownEditor() {
  console.log('🚀 Lancement du Studio Markdown DSFR...');
  
  // ============================================================================
  // ELEMENTS DU DOM
  // ============================================================================
  
  const textarea = document.getElementById("markdown-input");
  const preview = document.getElementById("preview");
  
  if (!textarea || !preview) {
    console.error('❌ Erreur: Éléments textarea ou preview introuvables');
    return;
  }
  
  console.log('✅ Éléments trouvés');
  
  let currentSlide = 0;
  let currentMode = 'normal';
  
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
  
  function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
      notif.style.opacity = '0';
      setTimeout(() => notif.remove(), 300);
    }, 2000);
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
      
      const color = options.color || '';
      const icon = options.icon || '';
      const link_label = options.link_label || '';
      const link_url = options.link_url || '';
      const link_newtab = options.link_newtab === true || options.link_newtab === 'true';
      const markup = options.markup || 'h3';
      
      const colorClass = color ? `fr-callout--${color}` : '';
      const iconClass = icon ? `fr-icon-${icon}` : '';
      const titleHtml = `<${markup} class="fr-callout__title ${iconClass}">${title.trim()}</${markup}>`;
      const contentHtml = `<p class="fr-callout__text">${marked.parseInline(actualContent)}</p>`;
      
      let linkHtml = '';
      if (link_label && link_url) {
        const targetAttr = link_newtab ? 'target="_blank" rel="noopener"' : '';
        linkHtml = `<a class="fr-btn fr-btn--sm" href="${link_url}" ${targetAttr}>${link_label}</a>`;
      }
      
      return `<div class="fr-callout ${colorClass}">
        ${titleHtml}
        ${contentHtml}
        ${linkHtml}
      </div>`;
    });
  }
  
  function processBadges(md) {
    const regex = /\/\/\/\s*badge\s*\n([\s\S]*?)\/\/\//g;
    
    return md.replace(regex, (match, content) => {
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
      const badgeText = contentLines.join(' ').trim();
      
      const type = options.type || '';
      const color = options.color || '';
      const icon = options.icon === true || options.icon === 'true';
      
      let badgeClass = 'fr-badge';
      if (type) badgeClass += ` fr-badge--${type}`;
      if (color) badgeClass += ` fr-badge--${color}`;
      if (icon) badgeClass += ` fr-icon-${type === 'success' ? 'checkbox-circle-line' : type === 'error' ? 'close-circle-line' : type === 'info' ? 'information-line' : type === 'warning' ? 'warning-line' : type === 'new' ? 'star-line' : ''}`;
      
      return `<p class="${badgeClass}">${badgeText}</p>`;
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
      
      const target = options.target || '#';
      const image = options.image || '';
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
    let result = md;
    
    result = result.replace(/\/\/\/\s*row\s*\|\s*([^\n]*)\n/g, (match, classes) => {
      return `<div class="fr-grid-row ${classes.trim()}">`;
    });
    
    result = result.replace(/\/\/\/\s*col\s*\|\s*([^\n]*)\n/g, (match, classes) => {
      const colClasses = classes.trim().split(/\s+/).map(c => `fr-col-${c}`).join(' ');
      return `<div class="${colClasses}">`;
    });
    
    result = result.replace(/\/\/\/\s*col\s*\n/g, '<div class="fr-col">');
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
    
    if (md.includes('---')) {
      currentMode = 'slides';
      renderSlides(md);
    } else {
      currentMode = 'normal';
      renderNormal(md);
    }
  }
  
  function renderNormal(md) {
    const processed = processAllComponents(md);
    const html = marked.parse(processed);
    preview.innerHTML = html;
  }
  
  function renderSlides(md) {
    const slides = md.split('---').map(s => s.trim()).filter(s => s);
    
    if (slides.length === 0) {
      preview.innerHTML = '<p>Aucune slide trouvée</p>';
      return;
    }
    
    const slideContent = slides[currentSlide] || slides[0];
    const processed = processAllComponents(slideContent);
    const html = marked.parse(processed);
    
    preview.innerHTML = `
      <div class="slide-container">
        <div class="slide-content">${html}</div>
        <div class="slide-controls">
          <button class="fr-btn fr-btn--secondary" id="prev-slide" ${currentSlide === 0 ? 'disabled' : ''}>
            ← Précédent
          </button>
          <span class="slide-counter">${currentSlide + 1} / ${slides.length}</span>
          <button class="fr-btn fr-btn--secondary" id="next-slide" ${currentSlide === slides.length - 1 ? 'disabled' : ''}>
            Suivant →
          </button>
        </div>
      </div>
    `;
    
    document.getElementById('prev-slide')?.addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        render();
      }
    });
    
    document.getElementById('next-slide')?.addEventListener('click', () => {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        render();
      }
    });
  }
  
  // ============================================================================
  // TEMPLATES
  // ============================================================================
  
  const templates = {
    site: `# 🎯 Bienvenue sur mon site

## 📢 Mise en avant

/// callout | Information importante
    color: blue-cumulus
    markup: h3
Ceci est une mise en avant pour attirer l'attention sur un point clé.
///

## 📋 Nos services

/// card | Service Premium
    target: /services/premium
    image: https://via.placeholder.com/400x200
Découvrez notre offre premium avec tous les avantages.
///

/// card | Service Standard
    target: /services/standard
    badge: Populaire|success
Accédez à nos services de base pour commencer.
///

## 📞 Contact

N'hésitez pas à nous contacter pour plus d'informations.`,
    
    email: `# ✉️ Objet : Informations importantes

Bonjour,

/// alert | Information
    type: info
    markup: h4
Nous vous informons que des changements importants vont avoir lieu.
///

## 📌 Points clés :

- Point important 1
- Point important 2
- Point important 3

/// callout | À noter
    color: green-menthe
    markup: h4
Cette information est essentielle pour la suite.
///

Cordialement,
L'équipe`,
    
    slides: `# 🎯 Titre de la présentation

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

Les points essentiels à retenir de cette présentation`
  };
  
  // ============================================================================
  // EVENT LISTENERS - Templates
  // ============================================================================
  
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
    currentSlide = 0;
    render();
    showNotification('Template Slides chargé ! 📊');
  });
  
  // ============================================================================
  // EVENT LISTENERS - Boutons d'action
  // ============================================================================
  
  document.getElementById("copy-html")?.addEventListener('click', () => {
    navigator.clipboard.writeText(preview.innerHTML)
      .then(() => showNotification("HTML copié ! 📋"))
      .catch(() => showNotification("Erreur de copie ❌"));
  });
  
  document.getElementById("copy-text")?.addEventListener('click', () => {
    navigator.clipboard.writeText(preview.textContent)
      .then(() => showNotification("Texte copié ! 📄"))
      .catch(() => showNotification("Erreur de copie ❌"));
  });
  
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
  
  document.getElementById("export-pdf")?.addEventListener('click', () => {
    window.print();
    showNotification("Impression lancée ! 📑");
  });
  
  document.getElementById("clear-all")?.addEventListener('click', () => {
    if (confirm('Êtes-vous sûr de vouloir tout effacer ?')) {
      textarea.value = '';
      render();
      localStorage.removeItem("markdown-content");
      showNotification("Contenu effacé ! 🗑️");
    }
  });
  
  // ============================================================================
  // MODE PLEIN ÉCRAN (comme le screenshot)
  // ============================================================================
  
  // Créer le bouton EXIT
  const exitBtn = document.createElement('button');
  exitBtn.className = 'exit-fullscreen-btn';
  exitBtn.innerHTML = '✕ Sortir du plein écran';
  document.body.appendChild(exitBtn);
  
  function toggleFullscreen() {
    const isFullscreen = document.body.classList.contains('fullscreen-mode');
    
    if (!isFullscreen) {
      // Activer le mode plein écran
      document.body.classList.add('fullscreen-mode');
      showNotification("Mode plein écran activé ⛶");
    } else {
      // Désactiver le mode plein écran
      document.body.classList.remove('fullscreen-mode');
      showNotification("Mode normal ⛶");
    }
  }
  
  // Bouton plein écran principal
  document.getElementById("fullscreen")?.addEventListener('click', toggleFullscreen);
  
  // Bouton EXIT
  exitBtn.addEventListener('click', toggleFullscreen);
  
  // ESC pour sortir
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('fullscreen-mode')) {
      toggleFullscreen();
    }
  });
  
  // ============================================================================
  // SYSTÈME DE THÈME - Intégré avec DSFR
  // ============================================================================
  
  function applyTheme(themeName) {
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-fr-scheme', themeName);
    localStorage.setItem("theme", themeName);
    
    const lightRadio = document.getElementById('fr-radios-theme-light');
    const darkRadio = document.getElementById('fr-radios-theme-dark');
    
    if (lightRadio && darkRadio) {
      lightRadio.checked = (themeName === 'light');
      darkRadio.checked = (themeName === 'dark');
    }
    
    console.log(`✅ Thème ${themeName} appliqué`);
  }
  
  const savedTheme = localStorage.getItem("theme") || 'light';
  applyTheme(savedTheme);
  
  document.querySelectorAll('input[name="fr-radios-theme"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const theme = e.target.value;
      applyTheme(theme);
      showNotification(theme === 'light' ? 'Mode clair activé ☀️' : 'Mode sombre activé 🌙');
    });
  });
  
  // ============================================================================
  // TOOLBAR - Gérer les dropdowns
  // ============================================================================
  
  document.querySelectorAll('.toolbar-btn').forEach(button => {
    button.addEventListener('click', () => {
      const group = button.getAttribute('data-group');
      const dropdown = document.getElementById(`dropdown-${group}`);
      
      if (!dropdown) return;
      
      // Fermer tous les autres dropdowns
      document.querySelectorAll('.toolbar-dropdown').forEach(d => {
        if (d !== dropdown) d.classList.add('hidden');
      });
      
      // Désactiver tous les autres boutons
      document.querySelectorAll('.toolbar-btn').forEach(b => {
        if (b !== button) b.classList.remove('active');
      });
      
      // Toggle le dropdown actuel
      dropdown.classList.toggle('hidden');
      button.classList.toggle('active');
    });
  });
  
  // Expand all / Collapse all
  document.getElementById('expand-all')?.addEventListener('click', () => {
    document.querySelectorAll('.toolbar-dropdown').forEach(d => d.classList.remove('hidden'));
    document.querySelectorAll('.toolbar-btn').forEach(b => b.classList.add('active'));
    showNotification('Tout ouvert 📂');
  });
  
  document.getElementById('collapse-all')?.addEventListener('click', () => {
    document.querySelectorAll('.toolbar-dropdown').forEach(d => d.classList.add('hidden'));
    document.querySelectorAll('.toolbar-btn').forEach(b => b.classList.remove('active'));
    showNotification('Tout fermé 📁');
  });
  
  // ============================================================================
  // INSERTION DE COMPOSANTS - CORRIGÉ pour les vrais retours à la ligne
  // ============================================================================
  
  document.querySelectorAll('[data-insert]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Récupérer le texte à insérer depuis l'attribut
      let textToInsert = button.getAttribute('data-insert');
      
      // IMPORTANT : Convertir les \\n littéraux en vrais retours à la ligne
      // Car dans les attributs HTML, \n est stocké comme \\n littéral
      textToInsert = textToInsert.replace(/\\n/g, '\n');
      
      // Récupérer la position du curseur
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      
      // Insérer le texte à la position du curseur
      const before = text.substring(0, start);
      const after = text.substring(end);
      
      // Ajouter des retours à la ligne pour séparer
      textarea.value = before + '\n\n' + textToInsert + '\n\n' + after;
      
      // Placer le curseur après le texte inséré
      const newCursorPos = start + textToInsert.length + 4;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      
      // Focus sur le textarea
      textarea.focus();
      
      // Rendre la preview
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
    
    // Render en temps réel
    render();
  });
  
  // Charger le contenu sauvegardé
  const savedContent = localStorage.getItem("markdown-content");
  if (savedContent) {
    textarea.value = savedContent;
    console.log('✅ Contenu restauré');
  }
  
  // ============================================================================
  // RENDER INITIAL
  // ============================================================================
  
  render();
  console.log('✅ Initialisation terminée !');
}

// ============================================================================
// POINT D'ENTRÉE - Attend vraiment que TOUT soit chargé
// ============================================================================

// Attendre que le DOM soit prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function attendreDSFR() {
    // Attendre que le DSFR soit initialisé
    // Le DSFR se charge en module, donc on attend un peu plus
    if (window.dsfr) {
      console.log('✅ DSFR détecté, lancement immédiat');
      lancerMarkdownEditor();
    } else {
      console.log('⏳ Attente du DSFR...');
      setTimeout(function() {
        lancerMarkdownEditor();
      }, 200);
    }
  });
} else {
  // Le DOM est déjà chargé
  if (window.dsfr) {
    console.log('✅ DSFR et DOM prêts, lancement');
    lancerMarkdownEditor();
  } else {
    console.log('⏳ DOM prêt, attente DSFR...');
    setTimeout(lancerMarkdownEditor, 200);
  }
}
