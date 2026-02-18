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

Le bouton **PDF** génère un vrai fichier `.pdf` :
- Charge automatiquement jsPDF depuis CDN (1ère utilisation)
- **Mode normal** : PDF `document-dsfr.pdf` avec le contenu
- **Mode slides** : PDF `slides-dsfr.pdf` avec TOUTES les slides (une par page)
- Conversion HTML → texte pour compatibilité maximale
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

- Le PDF utilise jsPDF (chargement dynamique ~200KB)
- Les styles DSFR complexes sont simplifiés dans le PDF (texte pur)
- Pour un PDF avec styles, utiliser "Télécharger HTML" puis ouvrir dans navigateur et imprimer en PDF
