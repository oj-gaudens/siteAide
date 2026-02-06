# 🎨 Intégration de la Boutique DSFR

## ✅ Ce qui a été fait

Votre site Markdown PRO MAX utilise maintenant **la boutique complète DSFR** (Design System de l'État Français) !

### 📦 Fichiers DSFR intégrés

La boutique DSFR complète se trouve dans : `src/assets/dsfr/`

Elle contient :
- **CSS** : `dsfr.min.css`, `dsfr.main.min.css`, `dsfr.print.min.css`
- **JavaScript** : `dsfr.module.min.js`, `dsfr.nomodule.min.js`
- **Icônes** : Tous les pictogrammes et icônes DSFR
- **Fonts** : Les polices Marianne
- **Favicon** : Favicon officiel de la République Française
- **Composants** : Tous les composants DSFR (alertes, boutons, cartes, etc.)

### 🔧 Modifications apportées

#### Dans `src/_includes/layout.njk` :

**CSS ajoutés (dans le `<head>`) :**
```html
<!-- DSFR CSS -->
<link rel="stylesheet" href="{{ '/assets/dsfr/dsfr.min.css' | url }}">
<link rel="stylesheet" href="{{ '/assets/dsfr/utility/icons/icons.min.css' | url }}">

<!-- DSFR Favicon -->
<link rel="apple-touch-icon" href="{{ '/assets/dsfr/favicon/apple-touch-icon.png' | url }}">
<link rel="icon" href="{{ '/assets/dsfr/favicon/favicon.svg' | url }}" type="image/svg+xml">
<link rel="shortcut icon" href="{{ '/assets/dsfr/favicon/favicon.ico' | url }}" type="image/x-icon">
```

**JavaScript ajoutés (avant `</body>`) :**
```html
<!-- DSFR JavaScript -->
<script type="module" src="{{ '/assets/dsfr/dsfr.module.min.js' | url }}"></script>
<script nomodule src="{{ '/assets/dsfr/dsfr.nomodule.min.js' | url }}"></script>
```

## 🚀 Utilisation

### Composants DSFR disponibles

Tous les composants DSFR sont maintenant disponibles dans votre Markdown :

#### 1. **Alertes DSFR**
```markdown
/// alert | Information
    type: info
Contenu de l'alerte
///
```

#### 2. **Boutons DSFR**
Utilisez directement dans votre HTML ou Markdown :
```html
<button class="fr-btn">Bouton primaire</button>
<button class="fr-btn fr-btn--secondary">Bouton secondaire</button>
```

#### 3. **Cartes DSFR**
```markdown
/// card | Titre de la carte
    image: /chemin/image.png
    target: /lien
Description
///
```

#### 4. **Accordéons DSFR**
```markdown
/// accordion | Question
Réponse
///
```

#### 5. **Badges DSFR**
```markdown
/// badge
    type: success
Validé
///
```

#### 6. **Icônes DSFR**
```html
<span class="fr-icon-checkbox-circle-line" aria-hidden="true"></span>
<span class="fr-icon-arrow-right-line" aria-hidden="true"></span>
```

### Classes CSS DSFR disponibles

Vous avez accès à toutes les classes utilitaires DSFR :

**Couleurs :**
- `.fr-text--blue-france` - Bleu France
- `.fr-text--red-marianne` - Rouge Marianne
- `.fr-background-alt--blue-france` - Fond bleu

**Espacement :**
- `.fr-mt-2w` - Margin top 2w
- `.fr-mb-4w` - Margin bottom 4w
- `.fr-p-3w` - Padding 3w

**Grilles :**
- `.fr-grid-row` - Ligne de grille
- `.fr-col-6` - Colonne 6/12
- `.fr-col-lg-4` - Colonne 4/12 sur grand écran

**Typography :**
- `.fr-text--lg` - Texte large
- `.fr-text--sm` - Texte petit
- `.fr-text--bold` - Texte en gras

## 📚 Documentation DSFR

Pour plus d'informations sur tous les composants disponibles :
- [Documentation officielle DSFR](https://www.systeme-de-design.gouv.fr/)
- [Composants DSFR](https://www.systeme-de-design.gouv.fr/composants)
- [Classes utilitaires](https://www.systeme-de-design.gouv.fr/elements-d-interface/fondamentaux-techniques/classes-utilitaires)

## 🎨 Exemples d'utilisation

### Page avec composants DSFR mixtes

```markdown
# Ma page avec DSFR

/// alert | Information importante
    type: info
Ceci utilise les styles DSFR !
///

<button class="fr-btn fr-btn--lg">
  Cliquez ici
  <span class="fr-icon-arrow-right-line fr-btn__icon--right" aria-hidden="true"></span>
</button>

/// row | fr-grid-row--gutters
/// col | 12 lg-6
<div class="fr-card">
  <div class="fr-card__body">
    <h4 class="fr-card__title">Carte DSFR</h4>
    <p class="fr-card__desc">Description de la carte</p>
  </div>
</div>
///
/// col | 12 lg-6
<div class="fr-card">
  <div class="fr-card__body">
    <h4 class="fr-card__title">Autre carte</h4>
    <p class="fr-card__desc">Autre description</p>
  </div>
</div>
///
///
```

## 🔍 Fichiers inclus

Structure du dossier DSFR :
```
src/assets/dsfr/
├── dsfr.min.css              # CSS principal minifié
├── dsfr.module.min.js        # JavaScript module
├── dsfr.nomodule.min.js      # JavaScript fallback
├── component/                 # Tous les composants
│   ├── accordion/
│   ├── alert/
│   ├── badge/
│   ├── button/
│   ├── card/
│   └── ... (48 composants)
├── fonts/                     # Polices Marianne
├── icons/                     # Pictogrammes et icônes
├── favicon/                   # Favicon République Française
└── utility/                   # Classes utilitaires
```

## ✨ Avantages

✅ **Conformité** : Respect des standards de l'État  
✅ **Accessibilité** : Composants accessibles RGAA  
✅ **Responsive** : Mobile-first design  
✅ **Performance** : Fichiers minifiés et optimisés  
✅ **Complet** : 48 composants + icônes + utilitaires  
✅ **À jour** : Dernière version de la boutique DSFR  

## 🚀 Pour démarrer

1. **Lancez le serveur** :
   ```bash
   npm start
   ```

2. **Testez les composants** :
   - Ouvrez `http://localhost:8080`
   - Utilisez les templates dans `src/_includes/templates/`
   - Consultez `DSFR_COMPONENTS.md` pour tous les exemples

3. **Personnalisez** :
   - Votre CSS custom dans `src/assets/css/style.css`
   - Vos scripts dans `src/js/script.js`
   - La boutique DSFR reste intacte dans `src/assets/dsfr/`

---

**🎉 Votre site utilise maintenant la boutique DSFR complète !**
