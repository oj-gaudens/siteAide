# 🚀 DÉPLOIEMENT SUR GITHUB PAGES

## ⚠️ IMPORTANT : Chemins et PathPrefix

Ce projet est configuré pour fonctionner sur GitHub Pages avec le repository `siteAide`.

### 📋 Configuration actuelle

- **URL GitHub Pages** : `https://TON-USERNAME.github.io/siteAide/`
- **PathPrefix** : `/siteAide/`
- **Dossier de sortie** : `docs/`

## 🔧 COMMENT DÉPLOYER

### 1️⃣ Installer les dépendances

```bash
npm install
```

### 2️⃣ Tester en local (SANS pathPrefix)

```bash
npm start
```

Ouvre http://localhost:8080 dans ton navigateur.

**Note** : En mode `npm start`, le pathPrefix est `/` pour que ça fonctionne en local !

### 3️⃣ Build pour GitHub Pages (AVEC pathPrefix)

```bash
npm run build
```

Cela génère le dossier `docs/` avec le pathPrefix `/siteAide/`.

### 4️⃣ Commit et Push

```bash
git add .
git commit -m "Build pour GitHub Pages"
git push origin main
```

### 5️⃣ Activer GitHub Pages

1. Va sur ton repository GitHub
2. Settings → Pages
3. Source : **Deploy from a branch**
4. Branch : **main** → Folder : **/docs** → Save

## ✅ VÉRIFICATION

Après le déploiement, va sur :
```
https://TON-USERNAME.github.io/siteAide/
```

Si la JS ne marche pas, vérifie dans la console (F12) :

### ✅ Chemins corrects :
```
✅ /siteAide/js/script.js
✅ /siteAide/assets/dsfr.module.min.js
✅ /siteAide/assets/css/style-dsfr-pur.css
```

### ❌ Chemins incorrects :
```
❌ /js/script.js (manque /siteAide/)
❌ //siteAide/js/script.js (double slash)
```

## 🔍 DÉBUG

Si la JS ne charge pas :

1. **Ouvre la console (F12)**
2. Regarde l'onglet **Network**
3. Vérifie que les fichiers `.js` se chargent avec le statut **200**

Si tu vois **404** :
- Le pathPrefix est mal configuré
- Vérifie que `npm run build` a bien été exécuté

## 📝 NOTES

- **En local** : `npm start` → pathPrefix = `/`
- **Sur GitHub Pages** : `npm run build` → pathPrefix = `/siteAide/`

C'est NORMAL que ça marche en local mais pas sur GitHub si tu oublies de faire `npm run build` !

## 🆘 AIDE

Si ça marche toujours pas :
1. Supprime le dossier `docs/`
2. Fais `npm run clean`
3. Fais `npm run build`
4. Commit et push

Bon déploiement ! 🔥
