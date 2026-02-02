---
layout: layout.njk
title: Accueil oj
---

# Bienvenue sur Markdown PRO MAX

Écrivez votre Markdown à gauche et voyez le rendu live à droite.

## Choisir un template :
<select id="template-selector">
  <option value="site">Site Web</option>
  <option value="email">Email</option>
  <option value="slides">Slides</option>
</select>

<section id="editor-container">
<textarea id="markdown-input">
# Exemple Markdown

- Liste
- Gras, italique
- Liens, images
- Slides : séparez avec ---
</textarea>

<div id="preview"></div>
</section>

<div class="toolbar">
<button id="copy-html">Copier HTML</button>
<button id="copy-text">Copier texte brut</button>
<button id="download-html">Télécharger HTML</button>
<button id="export-pdf">Exporter PDF</button>
<button id="clear-all">Effacer tout</button>
<button id="fullscreen">Plein écran</button>
<select id="theme-selector">
  <option value="theme-light">Clair</option>
  <option value="theme-dark">Sombre</option>
</select>
</div>

> Hover sur les encadrés bleus pour des aides inline selon le template.
