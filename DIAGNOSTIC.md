# 🔍 DIAGNOSTIC COMPLET - Pourquoi ça ne marche pas

## 🧪 ÉTAPE 1 : Test avec le fichier standalone

1. Ouvre `TEST-STANDALONE.html` directement dans ton navigateur (double-clic)
2. Appuie sur `F12` pour ouvrir la console
3. Tu dois voir dans la console :
   ```
   ✅ Script chargé et prêt !
   ✅ Preview mise à jour !
   ```

### ✅ SI ÇA MARCHE :
- ✅ JavaScript fonctionne
- ✅ Marked.js est chargé
- ✅ Le CSS fonctionne
- ❌ Le problème vient du build Eleventy

### ❌ SI ÇA NE MARCHE PAS :
- ❌ Problème de chemins CSS/JS
- ❌ Marked.js ne se charge pas (problème de connexion)

---

## 🔎 ÉTAPE 2 : Vérifier le build Eleventy

```bash
cd markdown-editor-clean
npm install
npm run build
```

### Vérifications :

1. **Le dossier `docs/` est créé ?**
   ```bash
   ls docs/
   ```
   Tu dois voir : `index.html`, `js/`, `assets/`

2. **Le fichier `docs/index.html` existe ?**
   ```bash
   cat docs/index.html | grep script.js
   ```
   Tu dois voir une ligne avec `<script src=".../js/script.js"></script>`

3. **Le fichier `docs/js/script.js` existe ?**
   ```bash
   ls docs/js/
   ```
   Tu dois voir : `script.js`

---

## 🌐 ÉTAPE 3 : Tester en local

```bash
npm start
```

Ouvre `http://localhost:8080`

### Tests à faire :

1. **Écris dans le textarea** → La preview doit se mettre à jour EN DIRECT
2. **Clique sur "Thème"** → La modale doit s'ouvrir
3. **Choisis "Thème sombre"** → TOUTE la page doit devenir noire
4. **Choisis "Thème clair"** → TOUTE la page doit redevenir blanche
5. **Clique sur "Template Site"** → Le textarea doit se remplir

### Si la preview ne s'affiche PAS :

Ouvre la console (`F12`) et cherche :
- ❌ `marked is not defined` → Marked.js ne se charge pas
- ❌ `Cannot read property 'value' of null` → Le textarea n'est pas trouvé
- ❌ `script.js:XXX Uncaught TypeError` → Erreur JavaScript

---

## 🐛 ÉTAPE 4 : Problèmes courants

### Problème 1 : La preview ne s'affiche pas

**Diagnostic console :**
```javascript
document.getElementById('markdown-input')  // doit retourner <textarea>
document.getElementById('preview')          // doit retourner <div>
typeof marked                               // doit retourner "function"
```

**Solutions :**
- Si `textarea` est null → L'ID est mauvais dans `index.njk`
- Si `preview` est null → L'ID est mauvais dans `index.njk`
- Si `marked` est undefined → Marked.js ne se charge pas (vérifie ta connexion internet)

---

### Problème 2 : Les boutons ne font rien

**Diagnostic console :**
```javascript
document.getElementById('copy-html')        // doit retourner <button>
document.getElementById('theme-light')      // doit retourner <button>
document.getElementById('load-template-site')  // doit retourner <button>
```

**Solutions :**
- Si un bouton retourne `null` → L'ID n'existe pas dans le HTML
- Vérifie que le script est chargé APRÈS le HTML :
  ```html
  <body>
    ...tous les boutons...
    <script src="js/script.js"></script>  ← À LA FIN
  </body>
  ```

---

### Problème 3 : Le thème ne change que le haut

**Diagnostic CSS :**
```javascript
document.documentElement.classList.contains('theme-dark')  // true si mode sombre
```

Ouvre les DevTools (`F12`) > Onglet **Elements** > Clique sur `<html>`

Tu dois voir :
```html
<html lang="fr" class="theme-dark" data-fr-scheme="dark">
```

Si tu vois `class="theme-dark"` mais que la page n'est pas noire :
→ Le CSS n'est pas chargé ou les règles sont mauvaises

**Vérifie le CSS :**
```bash
grep "html.theme-dark" src/assets/css/style-gouvernemental.css
```

Tu dois voir plein de lignes avec `html.theme-dark`

**PAS** `.theme-dark` (sans le `html.`)

---

### Problème 4 : Marked.js ne se charge pas

**Test :**
Ouvre la console et tape :
```javascript
typeof marked
```

Si ça retourne `undefined` :
1. Vérifie ta connexion internet
2. Vérifie que dans `layout.njk` tu as :
   ```html
   <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
   ```
3. Essaye un autre CDN :
   ```html
   <script src="https://unpkg.com/marked/marked.min.js"></script>
   ```

---

## 📊 ÉTAPE 5 : Checklist finale

Avant de publier sur GitHub :

- [ ] `TEST-STANDALONE.html` fonctionne ✅
- [ ] `npm run build` sans erreur ✅
- [ ] `npm start` fonctionne ✅
- [ ] La preview s'affiche EN DIRECT ✅
- [ ] Les boutons de templates fonctionnent ✅
- [ ] Le bouton "Thème" fonctionne ✅
- [ ] Le mode sombre change TOUTE la page ✅
- [ ] Le pathPrefix correspond au nom du repo ✅

---

## 🆘 Si RIEN ne marche

Envoie-moi :
1. **La console complète** (`F12` > Console > Screenshot)
2. **Le résultat de :**
   ```bash
   npm run build
   ```
3. **Le contenu de :**
   ```bash
   head -20 docs/index.html
   ```

Je t'aide ! 😊
