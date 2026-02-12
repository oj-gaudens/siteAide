#!/bin/bash

# Script de vérification des fichiers

echo "🔍 Vérification des fichiers du projet..."
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
        return 0
    else
        echo -e "${RED}❌${NC} $1 MANQUANT"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1/"
        return 0
    else
        echo -e "${RED}❌${NC} $1/ MANQUANT"
        return 1
    fi
}

echo "📁 Structure des dossiers :"
check_dir "src"
check_dir "src/_includes"
check_dir "src/assets"
check_dir "src/assets/css"
check_dir "src/js"
echo ""

echo "📄 Fichiers principaux :"
check_file "package.json"
check_file ".eleventy.js"
check_file "src/index.njk"
check_file "src/_includes/layout.njk"
echo ""

echo "🎨 CSS :"
check_file "src/assets/dsfr.min.css"
check_file "src/assets/css/style-dsfr-pur.css"
echo ""

echo "⚡ JavaScript :"
check_file "src/js/script-dsfr-pur.js"
echo ""

echo "📋 Configuration :"
echo "   jsFile dans index.njk : $(grep 'jsFile:' src/index.njk | cut -d':' -f2 | xargs)"
echo ""

echo "🚀 Pour lancer le projet :"
echo "   npm install"
echo "   npm start"
echo ""

echo "✅ Vérification terminée !"
