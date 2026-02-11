https://oj-gaudens.github.io/siteAide/
# 📝 Studio Markdown DSFR

Éditeur Markdown avec tous les composants du Système de Design de l'État Français (DSFR).

## 🚀 Utilisation en local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm start

# Builder pour la production
npm run build
```

## 📦 Déploiement sur GitHub Pages

### Étape 1 : Configuration du repo

1. Va dans **Settings** > **Pages**
2. Dans **Source**, choisis **Deploy from a branch**
3. Sélectionne la branche **gh-pages** et le dossier **/ (root)**
4. Clique sur **Save**

### Étape 2 : Modifier le pathPrefix

Dans le fichier `.eleventy.js`, change le `pathPrefix` pour qu'il corresponde au nom de ton repo :

```javascript
pathPrefix: "/TON-REPO-GITHUB/",  // Exemple: "/siteAide/"
```

### Étape 3 : Push et déploiement automatique

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push
```

Le GitHub Action va automatiquement :
1. Installer les dépendances
2. Builder le site avec Eleventy
3. Déployer sur la branche `gh-pages`

Ton site sera disponible à : `https://TON-USERNAME.github.io/TON-REPO/`

## 📁 Structure du projet

```
.
├── .eleventy.js          # Configuration Eleventy
├── package.json          # Dépendances npm
├── .github/
│   └── workflows/
│       └── build.yml     # GitHub Action pour le déploiement auto
├── src/
│   ├── _includes/
│   │   └── layout.njk    # Template de base
│   ├── assets/           # CSS et ressources DSFR
│   ├── js/
│   │   └── script.js     # JavaScript principal
│   └── index.njk         # Page d'accueil
└── docs/                 # Dossier généré (ne pas modifier)
```

## 🎨 Fonctionnalités

- ✅ Éditeur Markdown en temps réel
- ✅ Tous les composants DSFR (alertes, cartes, tuiles, badges, etc.)
- ✅ Mode clair/sombre
- ✅ Export HTML, PDF
- ✅ Templates prédéfinis (Site, Email, Slides)
- ✅ Sauvegarde automatique dans localStorage

## 🛠️ Technologies

- [Eleventy](https://www.11ty.dev/) - Générateur de site statique
- [DSFR](https://www.systeme-de-design.gouv.fr/) - Système de Design de l'État
- [Marked.js](https://marked.js.org/) - Parser Markdown

## 📝 Licence

MIT
