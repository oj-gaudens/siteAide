
https://oj-gaudens.github.io/siteAide/
# 🎯 Studio Markdown DSFR - Version Finale

## ✅ TOUT EST PRÊT À FONCTIONNER !

Ce projet utilise :
- **Eleventy (11ty)** pour générer le site statique
- **DSFR (Système de Design de l'État)** pour les composants
- **Marked.js** pour convertir le Markdown en HTML
- **Bleu Marine #000091** (couleur officielle du drapeau français)

---

## 🚀 INSTALLATION ET LANCEMENT

### 1️⃣ Prérequis
- **Node.js** version 14+ (vérifiez avec `node -v`)
- **npm** (vient avec Node.js)

### 2️⃣ Installation
```bash
# Décompresser le ZIP
unzip MARKDOWN-EDITOR-BLEU-MARINE-FINAL.zip
cd markdown-editor-optimized

# Installer les dépendances
npm install
```

### 3️⃣ Lancement
```bash
# Démarrer le serveur de développement
npm start
```

Le site s'ouvre automatiquement sur **http://localhost:8080** 🎉

---

## 📁 STRUCTURE DU PROJET

```
markdown-editor-optimized/
├── src/
│   ├── _includes/
│   │   └── layout.njk                 ← Template principal
│   ├── assets/
│   │   ├── dsfr.min.css              ← CSS DSFR officiel
│   │   ├── css/
│   │   │   └── style-dsfr-pur.css    ← Notre CSS (bleu marine)
│   │   └── [autres assets DSFR]
│   ├── js/
│   │   └── script-dsfr-pur.js        ← Notre JavaScript
│   └── index.njk                      ← Page principale
├── .eleventy.js                       ← Config Eleventy
├── package.json                       ← Dépendances
└── README.md                          ← Ce fichier
```

---

## 🎨 FICHIERS PRINCIPAUX

### CSS Utilisé
- **`src/assets/css/style-dsfr-pur.css`**
  - Utilise 100% les variables DSFR
  - Couleur bleu marine `#000091`
  - Support du thème sombre
  - Pas de conflit avec le DSFR

### JavaScript Utilisé
- **`src/js/script-dsfr-pur.js`**
  - Attend le chargement du DSFR
  - Corrige les retours à la ligne (`\n`)
  - Insertion à la position du curseur
  - Sauvegarde automatique

### Template
- **`src/_includes/layout.njk`**
  - Charge le DSFR
  - Charge notre CSS
  - Charge notre JS
  - Header + Footer DSFR

---

## ✨ FONCTIONNALITÉS

### 🔵 Boutons Bleu Marine
Tous les boutons de la toolbar sont en **bleu marine #000091** comme le drapeau français.

### 📝 Composants DSFR Disponibles
- **Alertes** (Info, Succès, Warning, Erreur)
- **Callouts** (Mise en avant colorée)
- **Badges** (Success, Error, Info, Warning, New)
- **Cartes** (Avec/sans image, avec badges)
- **Tuiles** (Avec pictos)
- **Accordéons** (Dépliants)
- **Grilles** (2, 3, 4 colonnes)
- **Markdown de base** (Titres, listes, liens, images, etc.)

### 🌓 Thème Sombre
Bascule entre mode clair et sombre avec le bouton "Thème" en haut à droite.

### 💾 Sauvegarde Automatique
Le contenu est sauvegardé automatiquement dans le localStorage.

### 📋 Actions Disponibles
- Copier HTML
- Copier texte
- Télécharger HTML
- Exporter PDF
- Effacer tout
- Mode plein écran

### 🎯 Templates Prédéfinis
Accédez aux templates via le menu :
- 🌐 **Site Web** : Page d'accueil complète
- ✉️ **Email** : Template d'email
- 📊 **Slides** : Présentation

---

## 🔧 DÉPANNAGE

### Le site ne se lance pas
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install
npm start
```

### Les boutons ne fonctionnent pas
1. Vérifiez que **Marked.js** est chargé (ligne 24 du layout.njk)
2. Ouvrez la console du navigateur (F12) pour voir les erreurs
3. Le script attend 100ms que le DSFR soit chargé

### Le thème sombre ne fonctionne pas
Le thème utilise l'attribut `data-fr-scheme`. Vérifiez dans la console :
```javascript
document.documentElement.getAttribute('data-fr-scheme')
// Devrait retourner 'light' ou 'dark'
```

---

## 📝 UTILISATION

### Insérer un composant
1. Cliquez sur un **bouton bleu** (ex: "ALERTES ▼")
2. Le dropdown s'ouvre
3. Cliquez sur un composant (ex: "ℹ️ Info")
4. Le composant s'insère dans l'éditeur
5. La preview se met à jour en temps réel

### Créer des slides
Séparez vos slides avec `---` :
```markdown
# Slide 1

Contenu de la première slide

---

# Slide 2

Contenu de la deuxième slide
```

### Syntaxe des composants DSFR

#### Alerte
```markdown
/// alert | Titre de l'alerte
    type: info
    markup: h4
Contenu de l'alerte.
///
```

#### Callout
```markdown
/// callout | Titre du callout
    color: blue-cumulus
    icon: info-line
    markup: h3
Contenu mis en avant.
///
```

#### Badge
```markdown
/// badge
    type: success
    icon: true
Validé
///
```

#### Carte
```markdown
/// card | Titre de la carte
    image: https://via.placeholder.com/300x200
    target: /page1
    badge: Nouveau | green-menthe
    markup: h4
Description de la carte.
///
```

---

## 🌐 DÉPLOIEMENT

### GitHub Pages
1. Modifiez `.eleventy.js` ligne 16 :
   ```javascript
   pathPrefix: "/nom-de-votre-repo/",
   ```
2. Buildez le site :
   ```bash
   npm run build
   ```
3. Le dossier `docs/` est généré
4. Activez GitHub Pages sur la branche `main` dossier `/docs`

### Netlify / Vercel
1. Connectez votre repo GitHub
2. Build command : `npm run build`
3. Publish directory : `docs`

---

## 🎯 COULEURS UTILISÉES

### Bleu Marine (Drapeau Français)
- **Normal** : `#000091`
- **Hover** : `#1212ff`
- **Active** : `#2323ff`

### Variables DSFR
Le CSS utilise les variables DSFR pour tout le reste :
- `--background-action-low-blue-france`
- `--text-title-blue-france`
- `--border-default-grey`
- etc.

---

## ✅ CHECKLIST DE FONCTIONNEMENT

Avant de signaler un bug, vérifiez :

- [ ] Node.js est installé (`node -v`)
- [ ] Les dépendances sont installées (`npm install`)
- [ ] Le serveur tourne (`npm start`)
- [ ] Le navigateur affiche http://localhost:8080
- [ ] La console ne montre pas d'erreurs (F12)
- [ ] Le fichier `src/js/script-dsfr-pur.js` existe
- [ ] Le fichier `src/assets/css/style-dsfr-pur.css` existe

---

## 📞 SUPPORT

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez que tous les fichiers sont présents
3. Essayez `npm install` puis `npm start`

---

## 📜 LICENCE

Ce projet utilise le DSFR qui est sous licence MIT.
Le code custom est libre d'utilisation.

---

**Créé avec ❤️ pour une expérience 100% DSFR !** 🇫🇷

**Version** : 1.0.0 - Bleu Marine Finale
**Date** : Février 2026
