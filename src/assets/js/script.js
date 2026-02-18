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
   * Sépare les lignes d'options des lignes de contenu.
   * Les options sont TOUJOURS en premier dans le bloc, avant le contenu.
   * Une ligne est une option si elle matche "key: value" (avec ou sans indentation)
   * mais pas "https://" (on protège les URLs).
   */
  function splitOptionsContent(rawContent) {
    // NE PAS trimmer rawContent ici — le trim() effaçait l'indentation de la 1ère ligne
    const lines = rawContent.split('\n');
    const optLines = [];
    const ctxLines = [];
    let optsDone = false;
    for (const line of lines) {
      // Option : ligne (éventuellement indentée) du style "  key: value"
      // Protection : on exclut "https://" et les lignes vides en mode opts
      if (!optsDone && /^\s*[\w_]+\s*:\s*\S/.test(line) && !/^\s*https?:\/\//.test(line)) {
        optLines.push(line);
      } else if (!optsDone && line.trim() === '') {
        // ligne vide entre options → on ignore
        continue;
      } else {
        optsDone = true;
        if (line.trim() !== '' || ctxLines.length > 0) {
          ctxLines.push(line);
        }
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

  let slideDirection = 1;

  function renderSlides(md) {
    const slides = md.split(/^---\s*$/m).map(s => s.trim()).filter(s => s);
    if (!slides.length) { preview.innerHTML = '<p>Aucune slide</p>'; return; }

    currentSlide = Math.max(0, Math.min(currentSlide, slides.length - 1));

    const tokenized = tokenizeComponents(slides[currentSlide]);
    let html = marked.parse(tokenized);
    html = restorePlaceholders(html);

    const pct  = Math.round(((currentSlide + 1) / slides.length) * 100);
    const isFs = preview.classList.contains('slides-fullscreen');
    const animClass = slideDirection > 0 ? 'slide-anim-next' : 'slide-anim-prev';

    preview.innerHTML = `
      <div class="slide-wrapper">
        <div class="slide-topbar">
          <div class="slide-progress">
            <div class="slide-progress-bar" style="width:${pct}%"></div>
          </div>
          ${isFs
            ? `<button class="slide-fs-exit-btn" id="slide-exit-fs">
                <i class="bi bi-fullscreen-exit"></i> Quitter le plein écran
               </button>`
            : `<button class="slide-fs-btn" id="slide-enter-fs">
                <i class="bi bi-fullscreen"></i> Plein écran
               </button>`
          }
        </div>
        <div class="slide-content ${animClass}">${html}</div>
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

    // Boutons navigation
    document.getElementById('prev-slide')?.addEventListener('click', () => {
      slideDirection = -1; currentSlide--; renderSlides(md);
    });
    document.getElementById('next-slide')?.addEventListener('click', () => {
      slideDirection = 1; currentSlide++; renderSlides(md);
    });

    // Boutons plein écran (dans la slide)
    document.getElementById('slide-enter-fs')?.addEventListener('click', () => {
      preview.classList.add('slides-fullscreen');
      document.body.classList.add('slides-fs-active');
      renderSlides(md);
    });
    document.getElementById('slide-exit-fs')?.addEventListener('click', () => {
      preview.classList.remove('slides-fullscreen');
      document.body.classList.remove('slides-fs-active');
      renderSlides(md);
    });

    // Clavier ← →
    if (preview._slideKeyHandler) document.removeEventListener('keydown', preview._slideKeyHandler);
    preview._slideKeyHandler = e => {
      if (document.activeElement === textarea) return;
      if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) { slideDirection = 1; currentSlide++; renderSlides(md); }
      if (e.key === 'ArrowLeft'  && currentSlide > 0)                  { slideDirection = -1; currentSlide--; renderSlides(md); }
      if (e.key === 'Escape' && preview.classList.contains('slides-fullscreen')) {
        preview.classList.remove('slides-fullscreen');
        document.body.classList.remove('slides-fs-active');
        renderSlides(md);
      }
    };
    document.addEventListener('keydown', preview._slideKeyHandler);
  }

  function render() {
    const md = textarea.value;
    if (isSlidesMode(md)) {
      renderSlides(md);
    } else {
      currentSlide = 0;
      slideDirection = 1;
      // Cacher les boutons slides dans la toolbar-tabs
      const enterBtn = document.getElementById('slide-enter-fs');
      const exitBtn2 = document.getElementById('slide-exit-fs');
      if (enterBtn) enterBtn.style.display = 'none';
      if (exitBtn2) exitBtn2.style.display = 'none';
      // Nettoyer le listener clavier slides
      if (preview._slideKeyHandler) {
        document.removeEventListener('keydown', preview._slideKeyHandler);
        preview._slideKeyHandler = null;
      }
      // Quitter le plein écran slides si actif
      preview.classList.remove('slides-fullscreen');
      document.body.classList.remove('slides-fs-active');
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
  // DROPDOWNS (Copier / Télécharger)
  // ============================================================================

  function setupDropdown(btnId, dropdownId) {
    const btn  = document.getElementById(btnId);
    const menu = document.getElementById(dropdownId);
    if (!btn || !menu) return;

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // Fermer tous les autres dropdowns
      document.querySelectorAll('.action-dropdown').forEach(d => {
        d.hidden = true;
        d.previousElementSibling?.setAttribute('aria-expanded', 'false');
      });
      // Toggle celui-ci
      btn.setAttribute('aria-expanded', String(!isOpen));
      menu.hidden = isOpen;
    });
  }

  setupDropdown('btn-copy-menu', 'copy-dropdown');
  setupDropdown('btn-download-menu', 'download-dropdown');

  // Fermer les dropdowns si on clique ailleurs
  document.addEventListener('click', () => {
    document.querySelectorAll('.action-dropdown').forEach(d => {
      d.hidden = true;
    });
    document.querySelectorAll('[aria-controls="copy-dropdown"], [aria-controls="download-dropdown"]').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
    });
  });

  // ============================================================================
  // BOUTONS D'ACTION
  // ============================================================================

  function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  // Fonction pour générer le HTML de toutes les slides (si en mode slides)
  function getAllSlidesHTML() {
    const md = textarea.value;
    if (!isSlidesMode(md)) {
      // Mode normal : juste le preview actuel
      return preview.innerHTML;
    }
    
    // Mode slides : générer toutes les slides
    const slides = md.split(/^---\s*$/m).map(s => s.trim()).filter(s => s);
    let allHTML = '';
    
    slides.forEach((slideContent, idx) => {
      const tokenized = tokenizeComponents(slideContent);
      let html = marked.parse(tokenized);
      html = restorePlaceholders(html);
      
      allHTML += `
        <div class="slide-page" style="page-break-after: always; min-height: 80vh; padding: 2rem; margin-bottom: 2rem; border-bottom: 3px solid #e5e5f4;">
          <div style="font-size: 0.75rem; color: #666; margin-bottom: 1rem;">Slide ${idx + 1} / ${slides.length}</div>
          ${html}
        </div>`;
    });
    
    return allHTML;
  }

  // --- COPIER HTML ---
  document.getElementById('copy-html')?.addEventListener('click', () => {
    const html = getAllSlidesHTML();
    navigator.clipboard.writeText(html)
      .then(() => notify(isSlidesMode(textarea.value) ? 'Toutes les slides copiées ! 📋' : 'HTML copié ! 📋'))
      .catch(() => notify('Erreur ❌'));
    document.getElementById('copy-dropdown').hidden = true;
    document.getElementById('btn-copy-menu')?.setAttribute('aria-expanded', 'false');
  });

  // --- COPIER MARKDOWN ---
  document.getElementById('copy-md')?.addEventListener('click', () => {
    navigator.clipboard.writeText(textarea.value)
      .then(() => notify('Markdown copié ! 📋'))
      .catch(() => notify('Erreur ❌'));
    document.getElementById('copy-dropdown').hidden = true;
    document.getElementById('btn-copy-menu')?.setAttribute('aria-expanded', 'false');
  });

  // --- TÉLÉCHARGER HTML ---
  document.getElementById('download-html')?.addEventListener('click', () => {
    const contentHTML = getAllSlidesHTML();
    const fullHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Export DSFR${isSlidesMode(textarea.value) ? ' - Slides' : ''}</title>
  <link rel="stylesheet" href="https://unpkg.com/@gouvfr/dsfr/dist/dsfr.min.css">
  <style>
    body { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .slide-page { margin-bottom: 3rem; }
    @media print {
      .slide-page { page-break-after: always; min-height: 100vh; }
    }
  </style>
</head>
<body class="fr-m-4w">
${contentHTML}
</body>
</html>`;
    const filename = isSlidesMode(textarea.value) ? 'slides-dsfr.html' : 'document-dsfr.html';
    downloadBlob(fullHtml, filename, 'text/html;charset=utf-8');
    notify(isSlidesMode(textarea.value) ? 'Toutes les slides téléchargées ! 💾' : 'HTML téléchargé ! 💾');
    document.getElementById('download-dropdown').hidden = true;
    document.getElementById('btn-download-menu')?.setAttribute('aria-expanded', 'false');
  });

  // --- TÉLÉCHARGER MARKDOWN ---
  document.getElementById('download-md')?.addEventListener('click', () => {
    downloadBlob(textarea.value, 'document.md', 'text/markdown;charset=utf-8');
    notify('Markdown téléchargé ! 💾');
    document.getElementById('download-dropdown').hidden = true;
    document.getElementById('btn-download-menu')?.setAttribute('aria-expanded', 'false');
  });

  // --- EXPORTER EN PDF (jsPDF) ---
  document.getElementById('export-pdf')?.addEventListener('click', async () => {
    // Charger jsPDF dynamiquement si pas déjà chargé
    if (typeof window.jspdf === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      document.head.appendChild(script);
      await new Promise(resolve => { script.onload = resolve; });
    }

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      
      const contentHTML = getAllSlidesHTML();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = contentHTML;
      tempDiv.style.cssText = 'position:absolute;left:-9999px;width:190mm;font-family:Arial,sans-serif;font-size:12pt;line-height:1.6;';
      document.body.appendChild(tempDiv);

      // Convertir le HTML en texte simple pour le PDF
      const textContent = tempDiv.innerText || tempDiv.textContent;
      const lines = doc.splitTextToSize(textContent, 180);
      
      let y = 20;
      const pageHeight = 280;
      const lineHeight = 7;
      
      lines.forEach(line => {
        if (y > pageHeight) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 15, y);
        y += lineHeight;
      });

      document.body.removeChild(tempDiv);
      
      const filename = isSlidesMode(textarea.value) ? 'slides-dsfr.pdf' : 'document-dsfr.pdf';
      doc.save(filename);
      notify(isSlidesMode(textarea.value) ? 'PDF de toutes les slides créé ! 📄' : 'PDF créé ! 📄');
    } catch (err) {
      console.error('Erreur PDF:', err);
      // Fallback sur window.print()
      window.print();
      notify('Impression lancée ! 📑');
    }
  });

  document.getElementById('clear-all')?.addEventListener('click', () => {
    if (!confirm('Effacer tout le contenu ?')) return;
    textarea.value = '';
    try { localStorage.removeItem('md-content'); } catch(e) {}
    render();
    notify('Contenu effacé 🗑️');
  });

  // ============================================================================
  // AUTO-SCROLL TEXTAREA — suit le curseur quand on tape
  // ============================================================================

  function scrollToCursor() {
    // Calcule la position approximative du curseur en pixels
    const lineHeight  = parseFloat(getComputedStyle(textarea).lineHeight) || 24;
    const paddingTop  = parseFloat(getComputedStyle(textarea).paddingTop)  || 0;
    const textBefore  = textarea.value.substring(0, textarea.selectionStart);
    const linesBefore = textBefore.split('\n').length;
    const cursorY     = paddingTop + (linesBefore - 1) * lineHeight;
    const visible     = textarea.clientHeight;
    // Si le curseur est hors de la zone visible, on scrolle
    if (cursorY < textarea.scrollTop + lineHeight) {
      textarea.scrollTop = cursorY - lineHeight;
    } else if (cursorY > textarea.scrollTop + visible - lineHeight * 2) {
      textarea.scrollTop = cursorY - visible + lineHeight * 2;
    }
  }

  textarea.addEventListener('keyup',   scrollToCursor);
  textarea.addEventListener('click',   scrollToCursor);
  textarea.addEventListener('input',   scrollToCursor);

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
    if (e.key === 'Escape') {
      if (document.body.classList.contains('fullscreen-mode')) toggleFullscreen();
      if (document.body.classList.contains('slides-fs-active')) {
        preview.classList.remove('slides-fullscreen');
        document.body.classList.remove('slides-fs-active');
        renderSlides(textarea.value);
      }
    }
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

  // Boutons onglet Templates (panneau toolbar)
  document.getElementById('load-template-site')?.addEventListener('click', () => {
    textarea.value = TEMPLATES.site; currentSlide = 0; render(); notify('Template Site chargé 🌐');
  });
  document.getElementById('load-template-email')?.addEventListener('click', () => {
    textarea.value = TEMPLATES.email; currentSlide = 0; render(); notify('Template Email chargé ✉️');
  });
  document.getElementById('load-template-slides')?.addEventListener('click', () => {
    textarea.value = TEMPLATES.slides; currentSlide = 0; render(); notify('Template Slides chargé 📊');
  });

  // Boutons du menu de navigation header (mêmes templates)
  document.getElementById('nav-template-site')?.addEventListener('click', () => {
    textarea.value = TEMPLATES.site; currentSlide = 0; render(); notify('Template Site chargé 🌐');
  });
  document.getElementById('nav-template-email')?.addEventListener('click', () => {
    textarea.value = TEMPLATES.email; currentSlide = 0; render(); notify('Template Email chargé ✉️');
  });
  document.getElementById('nav-template-slides')?.addEventListener('click', () => {
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
// POINT D'ENTRÉE - Attend DOM + marked.js
// ============================================================================

function tryLaunch(attempts) {
  // marked doit être chargé (CDN), textarea doit exister
  if (typeof marked !== 'undefined' && document.getElementById('markdown-input')) {
    lancerMarkdownEditor();
  } else if (attempts > 0) {
    setTimeout(() => tryLaunch(attempts - 1), 100);
  } else {
    console.error('❌ Impossible de lancer : marked ou textarea absent');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => tryLaunch(20));
} else {
  tryLaunch(20);
}
