# 🎨 Studio Markdown DSFR - Édition Complète

## ✨ Version avec TOUS les composants DSFR + Header/Footer officiels

Un éditeur Markdown professionnel avec l'apparence et les composants du Système de Design de l'État français.

---

## 🎯 Ce qui est inclus

### ✅ Header DSFR Officiel
- Logo "République Française" bleu
- Service title + tagline
- Menu responsive
- Bouton de thème clair/sombre

### ✅ Footer DSFR Officiel
- Logo République Française
- Liens vers legifrance, gouvernement.fr, service-public.fr, data.gouv.fr
- Mentions légales, accessibilité, RGPD
- Bouton paramètres d'affichage

### ✅ TOUS les CSS DSFR (710 KB)
- `dsfr.min.css` - CSS principal complet
- `utility.min.css` - Classes utilitaires
- `icons.min.css` - Toutes les icônes DSFR
- Fonts Marianne
- Favicons officiels

### ✅ Toolbar Ultra-Complète avec TOUS les boutons
- 📝 Markdown de base (gras, italique, titres, listes, liens, images, tableaux)
- 🚨 Alertes (info, success, error, warning)
- 📢 Mise en avant (callouts avec icônes et couleurs)
- 🎵 Accordéons (ouverts/fermés)
- 🏷️ Badges (tous types et couleurs)
- 📊 Tableaux et grilles
- 🎴 Cartes (horizontales, verticales, téléchargement, badges)
- 🧩 Tuiles (avec pictogrammes DSFR)

### ✅ Templates pré-configurés
- 🌐 Site Web
- ✉️ Email
- 📊 Slides

### ✅ Fonctionnalités
- ✅ Preview temps réel avec marked.js
- ✅ Export HTML complet
- ✅ Copier HTML/Markdown
- ✅ Thème clair/sombre/système
- ✅ Print/PDF
- ✅ Tout effacer
- ✅ Plein écran

---

## 🚀 Installation

### 1️⃣ Installer les dépendances

```bash
npm install
```

### 2️⃣ Lancer le serveur de développement

```bash
npm start
```

Le site sera disponible sur **http://localhost:8080**

### 3️⃣ Build de production

```bash
npm run build
```

Les fichiers générés seront dans le dossier `docs/`

---

## 📁 Structure du projet

```
markdown-editor-dsfr-final/
├── src/
│   ├── _includes/
│   │   └── layout.njk          ← Layout DSFR avec Header + Footer
│   ├── assets/
│   │   ├── dsfr.min.css       ← CSS DSFR complet (710 KB)
│   │   ├── dsfr.module.min.js
│   │   ├── dsfr.nomodule.min.js
│   │   ├── fonts/             ← Marianne
│   │   ├── icons/             ← Toutes les icônes DSFR
│   │   ├── favicon/           ← Favicons officiels
│   │   ├── artwork/           ← Pictogrammes DSFR
│   │   ├── component/         ← Composants DSFR
│   │   ├── utility/           ← Classes utilitaires
│   │   └── css/
│   │       └── style.css      ← CSS custom (minimal)
│   ├── js/
│   │   └── script.js          ← Script éditeur corrigé
│   └── index.njk              ← Page avec toolbar complète
├── .eleventy.js
├── package.json
└── README.md
```

---

## 🎨 Apparence

### Header DSFR Officiel
```
┌────────────────────────────────────────────┐
│  🇫🇷 République Française                    │
│                                            │
│  Studio Markdown DSFR                      │
│  Créez vos documents avec les composants   │
│  du système de design de l'État            │
└────────────────────────────────────────────┘
```

### Footer DSFR Officiel
```
┌────────────────────────────────────────────┐
│  🇫🇷 République Française                    │
│                                            │
│  Studio Markdown DSFR                      │
│  Système de Design de l'État               │
│                                            │
│  • legifrance.gouv.fr                      │
│  • gouvernement.fr                         │
│  • service-public.fr                       │
│  • data.gouv.fr                            │
│                                            │
│  Accessibilité | Mentions légales          │
│  Données personnelles | Paramètres         │
│                                            │
│  Licence etalab-2.0                        │
└────────────────────────────────────────────┘
```

---

## 🛠️ Composants DSFR disponibles

### Via les boutons de la toolbar :

✅ **Alertes** (`/// alert`)
✅ **Mise en avant** (`/// callout`)
✅ **Accordéons** (`/// accordion`)
✅ **Badges** (`/// badge`)
✅ **Cartes** (`/// card`)
✅ **Tuiles** (`/// tile`)
✅ **Grilles** (`/// row` + `/// col`)

---

## 💡 Exemples d'utilisation

### Alerte de succès

```markdown
/// alert | Opération réussie
    type: success
    markup: h3
Votre document a été créé avec succès !
///
```

### Callout avec icône et bouton

```markdown
/// callout | Information importante
    icon: info-line
    color: blue-cumulus
    link_label: En savoir plus
    link_url: https://example.com
Consultez notre documentation complète.
///
```

### Carte avec image et badge

```markdown
/// card | Titre de la carte
    image: /path/to/image.jpg
    badge: Nouveau | green-menthe
    target: /page
Description de la carte
///
```

---

## 🎯 Différences avec la version précédente

### ✅ Nouveau dans cette version :

1. **Header DSFR officiel** (bleu avec logo République Française)
2. **Footer DSFR officiel** (complet avec liens gouvernementaux)
3. **Modale de thème** (clair/sombre/système)
4. **TOUS les CSS DSFR** (710 KB de styles complets)
5. **Structure HTML conforme** (skiplinks, ARIA, sémantique)
6. **Apparence professionnelle** (comme un vrai site d'État)

### ✅ Conservé de la version précédente :

- ✅ Toolbar complète avec TOUS les boutons
- ✅ Script corrigé avec `marked.parse()`
- ✅ Templates (Site, Email, Slides)
- ✅ Export HTML
- ✅ Preview temps réel

---

## 🔧 Technologies utilisées

- **Eleventy (11ty)** - Générateur de site statique
- **DSFR 1.x** - Système de Design de l'État
- **Marked.js** - Parser Markdown → HTML
- **Vanilla JS** - Pas de framework lourd

---

## 📝 License

- **Code** : MIT
- **DSFR** : Licence MIT (gouvernement français)
- **Contenu** : etalab-2.0

---

## 🙏 Crédits

- **DSFR** : https://www.systeme-de-design.gouv.fr/
- **Eleventy** : https://www.11ty.dev/
- **Marked.js** : https://marked.js.org/

---

## 🎉 Prêt à utiliser !

1. `npm install`
2. `npm start`
3. Ouvrir http://localhost:8080
4. Profiter du meilleur éditeur Markdown DSFR ! 🚀
