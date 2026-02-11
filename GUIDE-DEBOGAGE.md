# 🔧 GUIDE DE DÉBOGAGE - Si les boutons ne marchent pas

## 🧪 ÉTAPE 1 : Tester avec le fichier de test

1. Ouvre le fichier `test-boutons.html` dans ton navigateur
2. Clique sur tous les boutons
3. Tu dois voir des messages verts s'afficher

**Si ça marche :**
✅ JavaScript fonctionne bien !
❌ Le problème vient du build Eleventy

**Si ça ne marche pas :**
❌ JavaScript n'est pas chargé ou il y a une erreur

---

## 🔍 ÉTAPE 2 : Vérifier la console du navigateur

1. Appuie sur `F12` pour ouvrir les outils de développement
2. Va dans l'onglet **Console**
3. Recharge la page (`F5`)

### Erreurs courantes :

❌ **"script.js 404 Not Found"**
→ Le fichier script.js n'est pas au bon endroit
→ Solution : Vérifie que `src/js/script.js` existe bien

❌ **"Uncaught ReferenceError: xxx is not defined"**
→ Une variable n'existe pas
→ Solution : Vérifie que tous les IDs correspondent

❌ **Rien ne s'affiche**
→ Le script ne se charge pas
→ Solution : Vérifie le chemin dans `layout.njk`

---

## 📁 ÉTAPE 3 : Vérifier la structure des fichiers

Assure-toi que la structure est :

```
markdown-editor-clean/
├── .eleventy.js
├── package.json
├── src/
│   ├── _includes/
│   │   └── layout.njk          ← Charge le script
│   ├── assets/
│   │   └── css/
│   │       └── style-gouvernemental.css  ← CSS du mode sombre
│   ├── js/
│   │   └── script.js           ← TON SCRIPT PRINCIPAL
│   └── index.njk               ← Page avec les boutons
└── docs/                       ← Généré par Eleventy (peut ne pas exister)
```

---

## 🔨 ÉTAPE 4 : Compiler manuellement

```bash
# Aller dans le dossier
cd markdown-editor-clean

# Installer les dépendances
npm install

# Compiler
npm run build

# Vérifier que docs/ est créé
ls docs/
```

Tu dois voir :
- `index.html`
- `js/script.js`
- `assets/` (avec tous les fichiers CSS)

---

## 🌐 ÉTAPE 5 : Tester en local

```bash
# Lancer le serveur local
npm start
```

Ouvre `http://localhost:8080`

**Teste les boutons :**
1. Clique sur **Charger Template Site** → Le textarea doit se remplir
2. Clique sur **Mode Sombre** → Toute la page doit devenir noire
3. Clique sur **Mode Clair** → Toute la page doit redevenir blanche

---

## 🐛 SI ÇA NE MARCHE TOUJOURS PAS

### Problème : Les boutons ne réagissent pas

**Vérification 1 :** Ouvre la console (`F12`) et tape :
```javascript
document.getElementById('theme-dark')
```

Si ça retourne `null` :
→ L'élément n'existe pas, vérifie l'ID dans `index.njk`

Si ça retourne un élément :
→ L'élément existe, vérifie que le script est bien chargé

**Vérification 2 :** Dans la console, tape :
```javascript
typeof showNotification
```

Si ça retourne `undefined` :
→ Le script n'est pas chargé
→ Vérifie le chemin dans `layout.njk`

Si ça retourne `function` :
→ Le script est chargé
→ Le problème vient des event listeners

---

### Problème : Le mode sombre ne change que le haut

**Solution :** Le CSS n'est pas appliqué correctement.

Vérifie que dans `style-gouvernemental.css` tu as :
```css
html.theme-dark {
  background: #161616 !important;
  color: #f6f6f6 !important;
}

html.theme-dark body {
  background: #161616 !important;
  color: #f6f6f6 !important;
}
```

**PAS** :
```css
.theme-dark {  /* ❌ Mauvais */
```

---

### Problème : La preview Markdown ne s'affiche pas

**Vérification :** Dans la console, tape :
```javascript
typeof marked
```

Si ça retourne `undefined` :
→ Marked.js n'est pas chargé
→ Vérifie que dans `layout.njk` tu as :
```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
```

---

## 📝 CHECKLIST FINALE

Avant de publier sur GitHub, vérifie :

- [ ] `npm install` sans erreur
- [ ] `npm run build` sans erreur
- [ ] Le dossier `docs/` est créé
- [ ] `npm start` fonctionne
- [ ] Les boutons marchent en local
- [ ] Le mode sombre change TOUTE la page
- [ ] La preview Markdown fonctionne
- [ ] Le pathPrefix dans `.eleventy.js` correspond au nom du repo

---

## 🆘 DERNIER RECOURS

Si vraiment rien ne marche, envoie-moi :
1. Une capture d'écran de la console (`F12`)
2. Le contenu de `docs/index.html` (première ligne)
3. Le message d'erreur exact

Je t'aiderai ! 😊
