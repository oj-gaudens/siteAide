# 📦 Export et Copie - Comment ça marche

## 📋 Copier

### Copier HTML
- **Mode normal** : Copie le contenu de la preview actuelle
- **Mode slides** : Copie TOUTES les slides en HTML, avec séparateurs

### Copier Markdown
- Copie toujours le contenu brut du textarea (Markdown source)
- Fonctionne pareil en mode normal et slides

## 💾 Télécharger

### Télécharger HTML
- **Mode normal** : Fichier `document-dsfr.html` avec le contenu actuel
- **Mode slides** : Fichier `slides-dsfr.html` avec TOUTES les slides
- Le fichier inclut le DSFR via CDN (autonome, peut s'ouvrir offline après 1ère visite)

### Télécharger Markdown
- Fichier `document.md` avec le source Markdown complet
- Fonctionne pareil en mode normal et slides

## 📄 Export PDF

Le bouton **PDF** génère un vrai fichier `.pdf` **avec le rendu graphique complet** :
- Utilise **html2pdf.js** (charge automatiquement depuis CDN ~500KB, 1ère utilisation)
- **Garde tous les styles DSFR** : couleurs, composants, mise en page
- **Mode normal** : PDF `document-dsfr.pdf` avec le contenu stylisé
- **Mode slides** : PDF `slides-dsfr.pdf` avec TOUTES les slides (une par page A4)
- Qualité haute résolution (scale 2x) pour un PDF net
- Fallback sur `window.print()` en cas d'erreur

## 🎯 Résumé

| Action | Mode normal | Mode slides |
|--------|------------|-------------|
| Copier HTML | Preview actuelle | Toutes les slides |
| Copier Markdown | Source complet | Source complet |
| Télécharger HTML | 1 fichier | Toutes les slides |
| Télécharger Markdown | 1 fichier | Source complet |
| PDF | 1 PDF | PDF multi-pages |

## ⚠️ Notes

- Le PDF utilise **html2pdf.js** (chargement dynamique ~500KB, converti HTML→Canvas→PDF)
- **Tous les styles DSFR sont préservés** : alertes bleues/vertes, callouts, cartes, badges...
- Génération prend 2-5 secondes selon la taille (conversion graphique)
- Qualité optimale pour impression et partage
- Images externes (via URL) doivent supporter CORS pour apparaître dans le PDF
