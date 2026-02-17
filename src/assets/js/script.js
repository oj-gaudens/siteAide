// ============================================================================
// MARKDOWN EDITOR DSFR - v3 Optimisé
// ============================================================================

function lancerMarkdownEditor() {
  console.log('🚀 Studio Markdown DSFR v3...');

  const textarea = document.getElementById('markdown-input');
  const preview  = document.getElementById('preview');
  if (!textarea || !preview) { console.error('❌ textarea/preview introuvables'); return; }

  // ============================================================================
  // ÉTAT
  // ============================================================================
  let currentSlide = 0;
  let renderTimer  = null;   // debounce render
  let saveTimer    = null;   // debounce sauvegarde

  // ============================================================================
  // UTILITAIRES
  // ============================================================================

  /** Échapper les caractères HTML dangereux dans les valeurs d'options */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** Génère un ID CSS-friendly depuis un texte (slugify FR) */
  function slugify(text) {
    return text.toLowerCase()
      .replace(/[àâä]/g, 'a').replace(/[éèêë]/g, 'e')
      .replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o')
      .replace(/[ùûü]/g, 'u').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  /**
   * Parse les options "key: value" d'un bloc composant.
   * Supporte les valeurs avec ":" dedans (ex: link_url: https://example.com)
   * Supporte les booleans true/false
   */
  function parseOptions(text) {
    const opts = {};
    if (!text) return opts;
    for (const line of text.split('\n')) {
      const m = line.match(/^\s*([\w_]+)\s*:\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2].trim();
      if (val === 'true')  val = true;
      else if (val === 'false') val = false;
      opts[key] = val;
    }
    return opts;
  }

  /**
   * Sépare les lignes d'options (indentées ou format "key:") des lignes de contenu.
   * Robuste : une ligne est une option si elle matche /^\s+\w+:/ OU /^\w+:(?!\/)/ 
   * (évite de matcher "https://" comme option)
   */
  function splitOptionsContent(rawContent) {
    const lines = rawContent.trim().split('\n');
    const optLines = [];
    const ctxLines = [];
    let optsDone = false; // les options sont toujours avant le contenu
    for (const line of lines) {
      if (!optsDone && /^\s+[\w_]+\s*:/.test(line)) {
        optLines.push(line);
      } else {
        optsDone = true;
        ctxLines.push(line);
      }
    }
    return { optText: optLines.join('\n'), content: ctxLines.join('\n').trim() };
  }

  /** Notification temporaire */
  function notify(msg) {
    // Supprimer les notifs existantes pour ne pas empiler
    document.querySelectorAll('.notification').forEach(n => n.remove());
    const el = document.createElement('div');
    el.className = 'notification';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s';
      setTimeout(() => el.remove(), 300);
    }, 2000);
  }

  // ============================================================================
  // PROCESSEURS DE COMPOSANTS DSFR
  // ============================================================================
  // Architecture : on extrait d'abord TOUS les blocs /// avec un tokenizer,
  // puis on substitue chaque bloc par un placeholder unique,
  // puis marked.parse() traite le Markdown restant,
  // puis on réinjecte les blocs HTML → évite que marked casse nos composants.

  const PLACEHOLDER_PREFIX = '\x02DSFR_BLOCK_';
  const PLACEHOLDER_SUFFIX = '\x03';
  const blockRegistry = new Map(); // id → html final

  function makePlaceholder(id) {
    return `${PLACEHOLDER_PREFIX}${id}${PLACEHOLDER_SUFFIX}`;
  }

  let _blockCounter = 0;
  function registerBlock(html) {
    const id = _blockCounter++;
    blockRegistry.set(id, html);
    return makePlaceholder(id);
  }

  function restorePlaceholders(html) {
    return html.replace(
      new RegExp(escapeRegex(PLACEHOLDER_PREFIX) + '(\\d+)' + escapeRegex(PLACEHOLDER_SUFFIX), 'g'),
      (_, id) => blockRegistry.get(Number(id)) || ''
    );
  }

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ---- ALERT ----
  function renderAlert(title, rawContent) {
    const { optText, content } = splitOptionsContent(rawContent);
    const opts    = parseOptions(optText);
    const type    = opts.type   || 'info';
    const markup  = opts.markup || 'h5';
    const validTypes = ['info', 'success', 'warning', 'error'];
    const safeType = validTypes.includes(type) ? type : 'info';
    const bodyHtml = content ? `<p>${marked.parseInline(content)}</p>` : '';
    return `<div class="fr-alert fr-alert--${safeType}" role="alert">
  <${markup} class="fr-alert__title">${escHtml(title.trim())}</${markup}>
  ${bodyHtml}
</div>`;
  }

  // ---- CALLOUT ----
  function renderCallout(title, rawContent) {
    const { optText, content } = splitOptionsContent(rawContent);
    const opts      = parseOptions(optText);
    const color     = opts.color      || '';
    const icon      = opts.icon       || '';
    const linkLabel = opts.link_label || '';
    const linkUrl   = opts.link_url   || '';
    const linkTab   = opts.link_newtab === true;
    const markup    = opts.markup     || 'h3';

    const colorClass = color ? ` fr-callout--${escHtml(color)}` : '';
    const iconClass  = icon  ? ` fr-icon-${escHtml(icon)}`      : '';
    const bodyHtml   = content ? `<p class="fr-callout__text">${marked.parseInline(content)}</p>` : '';
    const linkHtml   = (linkLabel && linkUrl)
      ? `<a class="fr-btn fr-btn--sm" href="${escHtml(linkUrl)}"${linkTab ? ' target="_blank" rel="noopener"' : ''}>${escHtml(linkLabel)}</a>`
      : '';
    return `<div class="fr-callout${colorClass}">
  <${markup} class="fr-callout__title${iconClass}">${escHtml(title.trim())}</${markup}>
  ${bodyHtml}
  ${linkHtml}
</div>`;
  }

  // ---- BADGE ----
  function renderBadge(rawContent) {
    const { optText, content } = splitOptionsContent(rawContent);
    const opts  = parseOptions(optText);
    const type  = opts.type  || '';
    const color = opts.color || '';
    const ICON_MAP = {
      success: 'checkbox-circle-line', error: 'close-circle-line',
      info: 'information-line', warning: 'warning-line', new: 'star-line'
    };
    let cls = 'fr-badge';
    if (type)  cls += ` fr-badge--${escHtml(type)}`;
    if (color) cls += ` fr-badge--${escHtml(color)}`;
    if (opts.icon === true && ICON_MAP[type]) cls += ` fr-icon-${ICON_MAP[type]}`;
    return `<p class="${cls}">${escHtml(content)}</p>`;
  }

  // ---- CARD ----
  function renderCard(title, rawContent) {
    const { optText, content } = splitOptionsContent(rawContent);
    const opts   = parseOptions(optText);
    const target = opts.target || '#';
    const image  = opts.image  || '';
    const badge  = opts.badge  || '';
    const markup = opts.markup || 'h4';

    const imgHtml = image
      ? `<div class="fr-card__img"><img src="${escHtml(image)}" class="fr-responsive-img" alt=""></div>`
      : '';
    let badgeHtml = '';
    if (badge) {
      const [bt, bc] = badge.split('|').map(s => s.trim());
      badgeHtml = `<p class="fr-badge fr-badge--sm fr-badge--${escHtml(bc || 'info')}">${escHtml(bt)}</p>`;
    }
    const descHtml = content ? `<p class="fr-card__desc">${marked.parseInline(content)}</p>` : '';
    return `<div class="fr-card fr-enlarge-link">
  ${imgHtml}
  <div class="fr-card__body">
    <div class="fr-card__content">
      ${badgeHtml}
      <${markup} class="fr-card__title"><a href="${escHtml(target)}" class="fr-card__link">${escHtml(title.trim())}</a></${markup}>
      ${descHtml}
    </div>
  </div>
</div>`;
  }

  // ---- TILE ----
  function renderTile(title, rawContent) {
    const { optText, content } = splitOptionsContent(rawContent);
    const opts   = parseOptions(optText);
    const picto  = opts.picto  || '';
    const target = opts.target || '#';
    const badge  = opts.badge  || '';
    const markup = opts.markup || 'h4';

    const pictoHtml = picto
      ? `<div class="fr-tile__img"><img src="/assets/icons/${escHtml(picto)}.svg" alt=""></div>`
      : '';
    let badgeHtml = '';
    if (badge) {
      const [bt, bc] = badge.split('|').map(s => s.trim());
      badgeHtml = `<p class="fr-badge fr-badge--sm fr-badge--${escHtml(bc || 'info')}">${escHtml(bt)}</p>`;
    }
    const descHtml = content ? `<p class="fr-tile__desc">${marked.parseInline(content)}</p>` : '';
    return `<div class="fr-tile fr-enlarge-link">
  <div class="fr-tile__body">
    ${badgeHtml}
    <${markup} class="fr-tile__title"><a href="${escHtml(target)}" class="fr-tile__link">${escHtml(title.trim())}</a></${markup}>
    ${descHtml}
  </div>
  ${pictoHtml}
</div>`;
  }

  // ---- ACCORDION ----
  // Compteur global pour garantir unicité des IDs
  let _accCounter = 0;
  function renderAccordion(title, rawContent) {
    const { optText, content } = splitOptionsContent(rawContent);
    const opts  = parseOptions(optText);
    const open  = opts.open === true;
    const id    = `acc-${slugify(title)}-${_accCounter++}`;
    const bodyHtml = marked.parse(content);
    return `<section class="fr-accordion">
  <h3 class="fr-accordion__title">
    <button class="fr-accordion__btn" aria-expanded="${open}" aria-controls="${id}">${escHtml(title.trim())}</button>
  </h3>
  <div class="fr-collapse${open ? ' fr-collapse--expanded' : ''}" id="${id}">
    ${bodyHtml}
  </div>
</section>`;
  }

  // ---- GRILLES (row / col) ----
  // Traitement séparé car ces blocs sont auto-fermants avec /// seul
  // et peuvent contenir d'autres blocs déjà tokenisés (placeholders)
  function processGrids(text) {
    let result = text;
    // Ouvrir row
    result = result.replace(/^\/\/\/\s*row(?:\s*\|\s*([^\n]*))?\s*$/gm, (_, cls) => {
      const extra = cls ? cls.trim() : '';
      return `<div class="fr-grid-row${extra ? ' ' + escHtml(extra) : ''}">`;
    });
    // Ouvrir col avec classes
    result = result.replace(/^\/\/\/\s*col\s*\|\s*([^\n]+)\s*$/gm, (_, cls) => {
      const colClasses = cls.trim().split(/\s+/).map(c => `fr-col-${c}`).join(' ');
      return `<div class="${colClasses}">`;
    });
    // Ouvrir col sans classe
    result = result.replace(/^\/\/\/\s*col\s*$/gm, '<div class="fr-col">');
    // Fermer avec /// seul sur une ligne
    result = result.replace(/^\/\/\/\s*$/gm, '</div>');
    return result;
  }

  // ============================================================================
  // TOKENIZER PRINCIPAL
  // Extrait tous les blocs /// composant | titre \n contenu \n ///
  // dans l'ordre correct (pas imbriqué, sauf grilles qui wrappe d'autres blocs)
  // ============================================================================

  /**
   * Remplace tous les blocs /// type | title \n ... \n /// par des placeholders.
   * On fait ça en plusieurs passes pour les composants simples (alert, callout, etc.),
   * puis on laisse les grilles gérer leurs /// row/col/fermetures.
   */
  function tokenizeComponents(md) {
    blockRegistry.clear();
    _blockCounter = 0;
    _accCounter   = 0;
    let text = md;

    // Regex générique pour un bloc /// TYPE [| TITLE] \n CONTENT \n ///
    // Note : lazy match sur le contenu, multiline
    const blockRe = /^\/\/\/\s*(alert|callout|badge|card|tile|accordion)\s*(?:\|\s*([^\n]*))?\n([\s\S]*?)^\/\/\/\s*$/gm;

    text = text.replace(blockRe, (match, type, title, rawContent) => {
      title = (title || '').trim();
      let html = '';
      switch (type) {
        case 'alert':     html = renderAlert(title, rawContent);     break;
        case 'callout':   html = renderCallout(title, rawContent);   break;
        case 'badge':     html = renderBadge(rawContent);            break;
        case 'card':      html = renderCard(title, rawContent);      break;
        case 'tile':      html = renderTile(title, rawContent);      break;
        case 'accordion': html = renderAccordion(title, rawContent); break;
      }
      return registerBlock(html);
    });

    // Grilles après (elles entourent les placeholders déjà créés)
    text = processGrids(text);

    return text;
  }

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================

  /**
   * Détecte si le doc est en mode slides : séparateur "---" seul sur une ligne,
   * mais UNIQUEMENT si le doc contient au moins 2 sections séparées ainsi.
   * Évite le false-positive avec les <hr> Markdown normaux.
   */
  function isSlidesMode(md) {
    const sections = md.split(/^---\s*$/m).filter(s => s.trim());
    return sections.length >= 2;
  }

  function renderNormal(md) {
    const tokenized = tokenizeComponents(md);
    // marked.parse traite le Markdown restant (titres, paragraphes, listes, code, hr...)
    let html = marked.parse(tokenized);
    // On réinjecte les composants DSFR (les placeholders ne sont pas touchés par marked)
    html = restorePlaceholders(html);
    preview.innerHTML = html;
    // Réinitialiser DSFR sur les accordéons si besoin
    if (window.dsfr && typeof window.dsfr === 'function') {
      try { window.dsfr(preview); } catch(e) {}
    }
  }

  function renderSlides(md) {
    const slides = md.split(/^---\s*$/m).map(s => s.trim()).filter(s => s);
    if (!slides.length) { preview.innerHTML = '<p>Aucune slide</p>'; return; }

    // Clamp currentSlide
    currentSlide = Math.max(0, Math.min(currentSlide, slides.length - 1));

    const tokenized = tokenizeComponents(slides[currentSlide]);
    let html = marked.parse(tokenized);
    html = restorePlaceholders(html);

    const pct = Math.round(((currentSlide + 1) / slides.length) * 100);
    preview.innerHTML = `
      <div class="slide-wrapper">
        <div class="slide-progress">
          <div class="slide-progress-bar" style="width:${pct}%"></div>
        </div>
        <div class="slide-content">${html}</div>
        <div class="slide-controls">
          <button class="fr-btn fr-btn--sm fr-btn--secondary" id="prev-slide" ${currentSlide === 0 ? 'disabled' : ''}>
            ← Précédent
          </button>
          <span class="slide-counter">${currentSlide + 1} / ${slides.length}</span>
          <button class="fr-btn fr-btn--sm fr-btn--secondary" id="next-slide" ${currentSlide === slides.length - 1 ? 'disabled' : ''}>
            Suivant →
          </button>
        </div>
      </div>`;

    document.getElementById('prev-slide')?.addEventListener('click', () => { currentSlide--; renderSlides(md); });
    document.getElementById('next-slide')?.addEventListener('click', () => { currentSlide++; renderSlides(md); });
  }

  function render() {
    const md = textarea.value;
    if (isSlidesMode(md)) {
      renderSlides(md);
    } else {
      currentSlide = 0; // reset si on quitte le mode slides
      renderNormal(md);
    }
  }

  /** Render avec debounce (évite de re-render à chaque frappe) */
  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 120); // 120ms : réactif mais pas frénétique
  }

  // ============================================================================
  // SAUVEGARDE AUTOMATIQUE (localStorage)
  // ============================================================================

  function saveContent() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem('md-content', textarea.value);
      } catch(e) { /* quota dépassé */ }
    }, 800);
  }

  const saved = (() => { try { return localStorage.getItem('md-content'); } catch(e) { return null; } })();
  if (saved) {
    textarea.value = saved;
    console.log('✅ Contenu restauré depuis localStorage');
  }

  textarea.addEventListener('input', () => {
    scheduleRender();
    saveContent();
  });

  // ============================================================================
  // INSERTION DE TEXTE DANS LE TEXTAREA
  // ============================================================================

  document.querySelectorAll('[data-insert]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const raw  = btn.getAttribute('data-insert');
      // Convertir les \n littéraux (attribut HTML) en vrais sauts de ligne
      const text = raw.replace(/\\n/g, '\n');
      const start = textarea.selectionStart;
      const end   = textarea.selectionEnd;
      const before = textarea.value.substring(0, start);
      const after  = textarea.value.substring(end);
      // Ajouter une ligne vide avant/après pour séparer proprement
      const sep    = before.endsWith('\n\n') || before === '' ? '' : '\n\n';
      textarea.value = before + sep + text + '\n\n' + after;
      const pos = start + sep.length + text.length + 2;
      textarea.setSelectionRange(pos, pos);
      textarea.focus();
      scheduleRender();
      saveContent();
      notify('Composant inséré ✨');
    });
  });

  // ============================================================================
  // ONGLETS
  // ============================================================================

  document.querySelectorAll('.toolbar-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const name = tab.dataset.tab;
      document.querySelectorAll('.toolbar-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.toolbar-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(`panel-${name}`)?.classList.add('active');
    });
  });

  // ============================================================================
  // BOUTONS D'ACTION
  // ============================================================================

  document.getElementById('copy-html')?.addEventListener('click', () => {
    navigator.clipboard.writeText(preview.innerHTML)
      .then(() => notify('HTML copié ! 📋'))
      .catch(() => notify('Erreur de copie ❌'));
  });

  document.getElementById('copy-text')?.addEventListener('click', () => {
    navigator.clipboard.writeText(preview.innerText)
      .then(() => notify('Texte copié ! 📄'))
      .catch(() => notify('Erreur de copie ❌'));
  });

  document.getElementById('download-html')?.addEventListener('click', () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Export DSFR</title>
  <link rel="stylesheet" href="https://unpkg.com/@gouvfr/dsfr/dist/dsfr.min.css">
</head>
<body class="fr-m-4w">
${preview.innerHTML}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'document-dsfr.html';
    a.click();
    URL.revokeObjectURL(url);
    notify('HTML téléchargé ! 💾');
  });

  document.getElementById('export-pdf')?.addEventListener('click', () => {
    window.print();
    notify('Impression lancée ! 📑');
  });

  document.getElementById('clear-all')?.addEventListener('click', () => {
    if (!confirm('Effacer tout le contenu ?')) return;
    textarea.value = '';
    try { localStorage.removeItem('md-content'); } catch(e) {}
    render();
    notify('Contenu effacé 🗑️');
  });

  // ============================================================================
  // PLEIN ÉCRAN
  // ============================================================================

  const exitBtn = document.getElementById('exit-fullscreen-inline');

  function toggleFullscreen() {
    const isFs = document.body.classList.contains('fullscreen-mode');
    document.body.classList.toggle('fullscreen-mode', !isFs);
    if (exitBtn) exitBtn.style.display = isFs ? 'none' : 'inline-flex';
    notify(isFs ? 'Mode normal ⛶' : 'Plein écran activé ⛶');
  }

  document.getElementById('fullscreen')?.addEventListener('click', toggleFullscreen);
  exitBtn?.addEventListener('click', toggleFullscreen);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('fullscreen-mode')) toggleFullscreen();
  });

  // ============================================================================
  // THÈME
  // ============================================================================

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-fr-scheme', theme);
    try { localStorage.setItem('theme', theme); } catch(e) {}
    const light = document.getElementById('fr-radios-theme-light');
    const dark  = document.getElementById('fr-radios-theme-dark');
    if (light) light.checked = theme === 'light';
    if (dark)  dark.checked  = theme === 'dark';
  }

  const savedTheme = (() => { try { return localStorage.getItem('theme'); } catch(e) { return null; } })() || 'light';
  applyTheme(savedTheme);

  document.querySelectorAll('input[name="fr-radios-theme"]').forEach(radio => {
    radio.addEventListener('change', e => {
      applyTheme(e.target.value);
      notify(e.target.value === 'light' ? 'Mode clair ☀️' : 'Mode sombre 🌙');
    });
  });

  // ============================================================================
  // TEMPLATES
  // ============================================================================

  const TEMPLATES = {
    site: `# 🎯 Bienvenue sur notre site

## Mise en avant

/// callout | Information importante
    color: blue-cumulus
    markup: h3
Ceci est une mise en avant pour attirer l'attention sur un point clé.
///

## Nos services

/// row | fr-grid-row--gutters
/// col | 12 lg-4
/// card | Service Premium
    target: /services/premium
    image: https://via.placeholder.com/400x200
    badge: Recommandé|green-menthe
    markup: h4
Découvrez notre offre premium avec tous les avantages.
///
///
/// col | 12 lg-4
/// card | Service Standard
    target: /services/standard
    badge: Populaire|yellow-tournesol
    markup: h4
Accédez à nos services de base pour commencer.
///
///
/// col | 12 lg-4
/// card | Service Découverte
    target: /services/decouverte
    markup: h4
Essayez gratuitement nos services.
///
///
///

## FAQ

/// accordion | Comment ça fonctionne ?
Nous vous guidons étape par étape pour utiliser nos services.
///

/// accordion | C'est gratuit ?
    open: true
Oui, l'accès de base est entièrement gratuit.
///`,

    email: `# ✉️ Objet : Informations importantes

Bonjour,

/// alert | Information
    type: info
    markup: h4
Nous vous informons que des changements importants vont avoir lieu le 1er mars.
///

## Points clés

- Point important 1
- Point important 2
- Point important 3

/// callout | À noter
    color: green-menthe
    markup: h4
Cette information est essentielle pour la suite de votre démarche.
///

Cordialement,  
L'équipe`,

    slides: `# 🎯 Titre de la présentation

**Sous-titre de la présentation**

---

## Plan

- Point 1
- Point 2
- Point 3

---

## Slide avec alerte

/// alert | Information importante
    type: info
    markup: h4
Ceci est un point clé à retenir.
///

Texte supplémentaire avec **mise en gras**.

---

## Conclusion

/// callout | À retenir
    color: blue-cumulus
    markup: h3
Les points essentiels de cette présentation.
///`
  };

  document.getElementById('load-template-site')?.addEventListener('click', () => {
    textarea.value = TEMPLATES.site; currentSlide = 0; render(); notify('Template Site chargé 🌐');
  });
  document.getElementById('load-template-email')?.addEventListener('click', () => {
    textarea.value = TEMPLATES.email; currentSlide = 0; render(); notify('Template Email chargé ✉️');
  });
  document.getElementById('load-template-slides')?.addEventListener('click', () => {
    textarea.value = TEMPLATES.slides; currentSlide = 0; render(); notify('Template Slides chargé 📊');
  });

  // ============================================================================
  // RACCOURCIS CLAVIER dans le textarea
  // ============================================================================

  textarea.addEventListener('keydown', e => {
    // Tab → insérer 4 espaces (ne pas perdre le focus)
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = textarea.selectionStart;
      const v = textarea.value;
      textarea.value = v.substring(0, s) + '    ' + v.substring(textarea.selectionEnd);
      textarea.setSelectionRange(s + 4, s + 4);
      return;
    }
    // Ctrl/Cmd + B → gras
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      wrapSelection('**', '**');
    }
    // Ctrl/Cmd + I → italique
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      wrapSelection('*', '*');
    }
    // Ctrl/Cmd + K → lien
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const sel = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
      wrapSelection('[', `](${sel ? 'url' : 'texte'})`);
    }
  });

  function wrapSelection(before, after) {
    const s    = textarea.selectionStart;
    const e    = textarea.selectionEnd;
    const sel  = textarea.value.substring(s, e) || 'texte';
    const v    = textarea.value;
    textarea.value = v.substring(0, s) + before + sel + after + v.substring(e);
    textarea.setSelectionRange(s + before.length, s + before.length + sel.length);
    scheduleRender();
  }

  // ============================================================================
  // RENDER INITIAL
  // ============================================================================

  render();
  console.log('✅ Studio Markdown DSFR v3 prêt !');
}

// ============================================================================
// POINT D'ENTRÉE
// ============================================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(lancerMarkdownEditor, window.dsfr ? 0 : 200);
  });
} else {
  setTimeout(lancerMarkdownEditor, window.dsfr ? 0 : 200);
}
