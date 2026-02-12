# 🚀 MARKDOWN EDITOR - GUIDE COMPLET

## ⚡ SOLUTION AU PROBLÈME JS

Le problème était le **pathPrefix** qui cassait les chemins !

**MAINTENANT** : Détection automatique ! ✅
- En **local** → pathPrefix = `/` 
- Sur **GitHub Pages** → pathPrefix = `/siteAide/`

---

## 🔧 INSTALLATION

```bash
npm install
```

---

## 💻 DÉVELOPPEMENT LOCAL

```bash
npm start
```

Ouvre http://localhost:8080

✅ **La JS fonctionne !**
✅ **Pas de pathPrefix !**
✅ **Tout marche en local !**

---

## 🌐 DÉPLOIEMENT GITHUB PAGES

### 1️⃣ Build pour production

**Sur Mac/Linux :**
```bash
npm run build
```

**Sur Windows :**
```bash
npm run build:win
```

### 2️⃣ Commit et Push

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### 3️⃣ Activer GitHub Pages

1. Va sur ton repository GitHub
2. **Settings** → **Pages**
3. Source : **Deploy from a branch**
4. Branch : **main** → Folder : **/docs** → **Save**

### 4️⃣ Accéder au site

```
https://TON-USERNAME.github.io/siteAide/
```

✅ **La JS fonctionne !**
✅ **PathPrefix appliqué automatiquement !**
✅ **Tout marche sur GitHub Pages !**

---

## 🎯 COMMENT ÇA MARCHE ?

### En local (`npm start`)
```
ELEVENTY_ENV non défini → pathPrefix = "/"
```

Chemins générés :
```
✅ /js/script.js
✅ /assets/dsfr.module.min.js
✅ /assets/css/style-dsfr-pur.css
```

### Sur GitHub (`npm run build`)
```
ELEVENTY_ENV=production → pathPrefix = "/siteAide/"
```

Chemins générés :
```
✅ /siteAide/js/script.js
✅ /siteAide/assets/dsfr.module.min.js
✅ /siteAide/assets/css/style-dsfr-pur.css
```

---

## 🐛 DÉPANNAGE

### La JS ne marche pas en local ?

```bash
# Vérifie que ELEVENTY_ENV n'est PAS défini
echo $ELEVENTY_ENV

# Si ça affiche "production", fais :
unset ELEVENTY_ENV

# Puis relance
npm start
```

### La JS ne marche pas sur GitHub Pages ?

```bash
# Vérifie que tu as bien build avec :
npm run build

# Vérifie dans docs/index.html que les chemins ont /siteAide/
cat docs/index.html | grep "script.js"
# Devrait afficher : /siteAide/js/script.js
```

### Sur Windows, `npm run build` ne marche pas ?

Utilise :
```bash
npm run build:win
```

---

## 📝 RÉSUMÉ

| Commande | Environnement | PathPrefix | Usage |
|----------|---------------|------------|-------|
| `npm start` | Local | `/` | Développement |
| `npm run build` | Production (Mac/Linux) | `/siteAide/` | GitHub Pages |
| `npm run build:win` | Production (Windows) | `/siteAide/` | GitHub Pages |

---

## ✅ CHECKLIST AVANT PUSH

- [ ] `npm run build` exécuté
- [ ] Dossier `docs/` généré
- [ ] Fichiers JS dans `docs/js/`
- [ ] `git add .` fait
- [ ] `git commit` fait
- [ ] `git push` fait
- [ ] GitHub Pages activé sur **/docs**

---

**C'est tout ! Ça marche partout maintenant ! 🔥**
