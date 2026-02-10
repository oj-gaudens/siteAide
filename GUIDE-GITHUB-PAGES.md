# 🚀 GUIDE RAPIDE - Déployer sur GitHub Pages

## ⚡ EN 3 ÉTAPES SIMPLES

### 📋 ÉTAPE 1 : Préparer ton repo GitHub

1. **Crée un nouveau repo** sur GitHub (exemple : `siteAide`)
2. **Clone-le** sur ton ordinateur :
   ```bash
   git clone https://github.com/TON-USERNAME/siteAide.git
   cd siteAide
   ```
3. **Copie tous les fichiers** du ZIP dans ce dossier

---

### ⚙️ ÉTAPE 2 : Configurer le pathPrefix

Ouvre le fichier `.eleventy.js` et change cette ligne :

```javascript
pathPrefix: "/siteAide/",  // ⚠️ METS LE NOM DE TON REPO ICI
```

**IMPORTANT :** Le nom doit correspondre EXACTEMENT au nom de ton repo GitHub !

Exemples :
- Si ton repo s'appelle `mon-site` → `pathPrefix: "/mon-site/"`
- Si ton repo s'appelle `siteAide` → `pathPrefix: "/siteAide/"`

---

### 🔧 ÉTAPE 3 : Activer GitHub Pages

1. Va sur GitHub dans ton repo
2. Clique sur **Settings** (en haut)
3. Dans le menu de gauche, clique sur **Pages**
4. Dans **Source**, choisis :
   - Branch : **gh-pages**
   - Folder : **/ (root)**
5. Clique sur **Save**

---

### 📤 ÉTAPE 4 : Push et déployer

Dans ton terminal :

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

**Le GitHub Action va automatiquement :**
1. ✅ Installer les dépendances npm
2. ✅ Compiler le site avec Eleventy
3. ✅ Créer la branche `gh-pages`
4. ✅ Déployer ton site

---

### 🎉 ÉTAPE 5 : Vérifier que ça marche

Attends 1-2 minutes, puis va sur :

```
https://TON-USERNAME.github.io/siteAide/
```

(Remplace `TON-USERNAME` et `siteAide` par tes vraies valeurs)

---

## 🐛 SI ÇA NE MARCHE PAS

### Problème 1 : Le site est tout cassé (pas de CSS)

**Solution :** Vérifie que le `pathPrefix` dans `.eleventy.js` correspond EXACTEMENT au nom de ton repo.

---

### Problème 2 : Erreur 404

**Solutions :**
1. Va dans **Settings > Pages** et vérifie que la source est bien `gh-pages`
2. Vérifie que la branche `gh-pages` existe (elle est créée automatiquement par le GitHub Action)
3. Attends 2-3 minutes après le push

---

### Problème 3 : Le GitHub Action échoue

**Solution :** Va dans l'onglet **Actions** de ton repo pour voir l'erreur.

Souvent c'est :
- Les dépendances npm qui manquent → Vérifie que `package.json` est bien présent
- Erreur de build → Vérifie que tous les fichiers sont bien commités

---

## 🔄 POUR METTRE À JOUR TON SITE

1. Modifie tes fichiers
2. Commit et push :
   ```bash
   git add .
   git commit -m "Mise à jour"
   git push
   ```

Le site se met à jour automatiquement ! 🎉

---

## 📱 TESTER EN LOCAL AVANT DE PUBLIER

```bash
# Installer les dépendances (une seule fois)
npm install

# Lancer le serveur local
npm start
```

Ouvre ton navigateur sur `http://localhost:8080`

---

## ✅ CHECKLIST FINALE

- [ ] J'ai créé mon repo sur GitHub
- [ ] J'ai modifié le `pathPrefix` dans `.eleventy.js`
- [ ] J'ai activé GitHub Pages dans Settings > Pages
- [ ] J'ai fait `git push`
- [ ] J'ai attendu 2 minutes
- [ ] Mon site marche sur `https://USERNAME.github.io/REPO/`

---

**Bon courage ! 🚀**
