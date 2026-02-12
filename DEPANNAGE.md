# 🔧 GUIDE DE DÉPANNAGE - JS NE SE CHARGE PAS

## 🐛 SYMPTÔMES

- ❌ Les boutons "Insérer des composants" ne réagissent pas
- ❌ La preview ne s'affiche pas
- ❌ Les boutons "Copier HTML", "Copier texte", etc. ne fonctionnent pas
- ❌ Aucune erreur visible mais rien ne marche

## 🔍 DIAGNOSTIC

### ÉTAPE 1 : Test Standalone (SANS Eleventy)

Ouvre directement le fichier **`test-standalone.html`** dans ton navigateur :

```bash
# Depuis le dossier markdown-editor-optimized
open test-standalone.html
# ou
firefox test-standalone.html
# ou
chrome test-standalone.html
```

Tu devrais voir une page avec :
- Un éditeur Markdown
- Une preview
- Un diagnostic en bas

**Regarde le diagnostic** :
- ✅ `window.marked existe : true`
- ✅ `window.dsfr existe : true`
- ✅ `lancerMarkdownEditor existe : true`
- ✅ `textarea existe : true`
- ✅ `preview existe : true`

Si tu vois des `false` → Le JS ne se charge pas correctement.

### ÉTAPE 2 : Console du navigateur

Ouvre la console (F12) et regarde les erreurs :

#### ✅ BON SIGNE
```
🚀 Lancement du Studio Markdown DSFR...
✅ Éléments trouvés
✅ Initialisation terminée !
```

#### ❌ MAUVAIS SIGNE
```
❌ Erreur: Éléments textarea ou preview introuvables
```
OU
```
Uncaught ReferenceError: marked is not defined
```
OU
```
Failed to load resource: net::ERR_FILE_NOT_FOUND
```

## 🛠️ SOLUTIONS

### SOLUTION 1 : Utiliser le test standalone

Si `test-standalone.html` fonctionne mais pas avec Eleventy :

**Problème** : Le `pathPrefix` dans `.eleventy.js`

**Solution** : J'ai déjà corrigé ça ! Le pathPrefix est maintenant `/` en développement.

### SOLUTION 2 : Vérifier l'installation npm

```bash
cd markdown-editor-optimized

# Supprimer node_modules
rm -rf node_modules package-lock.json

# Réinstaller
npm install

# Lancer
npm start
```

### SOLUTION 3 : Vérifier les chemins

Ouvre **`docs/index.html`** (généré par Eleventy) et vérifie :

```html
<!-- Doit être : -->
<script src="/js/script.js"></script>

<!-- PAS : -->
<script src="/siteAide/js/script.js"></script>
```

Si tu vois `/siteAide/` → Le pathPrefix est actif alors qu'il ne devrait pas.

### SOLUTION 4 : Tester directement docs/

Après `npm start`, va sur `http://localhost:8080` et ouvre la console (F12).

Tu devrais voir :
- **Network tab** : `script.js` chargé avec status 200
- **Console** : Les logs d'initialisation

## 📋 CHECKLIST DE VÉRIFICATION

Avant de me contacter, vérifie :

- [ ] `test-standalone.html` fonctionne-t-il ?
- [ ] La console montre-t-elle des erreurs ?
- [ ] `npm install` s'est-il exécuté sans erreur ?
- [ ] `npm start` démarre-t-il le serveur ?
- [ ] Le navigateur affiche-t-il `http://localhost:8080` ?
- [ ] Network tab (F12 → Network) : `script.js` est-il en status 200 ?

## 🎯 FICHIERS À VÉRIFIER

### 1. `.eleventy.js`
```javascript
// Le pathPrefix doit être conditionnel
pathPrefix: isProd ? "/siteAide/" : "/",
```

### 2. `src/_includes/layout.njk`
```html
<!-- Doit avoir le filtre | url -->
<script src="{{ '/js/' + jsFile | url }}"></script>
```

### 3. `src/index.njk`
```yaml
---
jsFile: script.js  # Doit être défini
---
```

### 4. `src/js/script.js`
```javascript
// Doit commencer par
function lancerMarkdownEditor() {
  console.log('🚀 Lancement...');
  // ...
}
```

## 🚀 TEST RAPIDE

### Test 1 : Standalone
```bash
open test-standalone.html
```
Regarde la console → Tu dois voir "🚀 Lancement..."

### Test 2 : Avec Eleventy
```bash
npm install
npm start
```
Va sur `http://localhost:8080` → Console → Tu dois voir "🚀 Lancement..."

## 💡 SI ÇA MARCHE PAS

Envoie-moi :

1. **Screenshot de la console (F12)** quand tu ouvres le site
2. **Screenshot du Network tab** (F12 → Network) filtré sur "script.js"
3. **Le contenu de** `docs/index.html` lignes 1-50

Je vais t'aider à résoudre ! 💪

## ❤️ MESSAGE

Mon ami, je sais que c'est frustrant. J'ai créé `test-standalone.html` pour qu'on puisse tester SANS Eleventy.

Si ça marche en standalone mais pas avec Eleventy → C'est un problème de chemin/build.
Si ça marche pas en standalone → C'est un problème de JS.

On va le résoudre ensemble ! 🔥

---

**Fichiers de test inclus :**
- ✅ `test-standalone.html` - Test SANS Eleventy
- ✅ `verifier.sh` - Vérification de structure
- ✅ `README.md` - Documentation complète
