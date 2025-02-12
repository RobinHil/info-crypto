# InfoCrypto

Une application web moderne qui exploite l'API de CoinGecko pour visualiser et suivre les cryptomonnaies en temps réel.

## Fonctionnalités

- Affichage des 100 premières cryptomonnaies par capitalisation
- Actualisation automatique des données toutes les minutes
- Graphiques interactifs montrant l'évolution des prix sur 24h et 30 jours
- Fonction de recherche pour trouver n'importe quelle cryptomonnaie
- Informations détaillées pour chaque cryptomonnaie :
  - Prix actuel et variations
  - Rang de capitalisation
  - Supply (circulant, total et maximum)
  - Variations de prix sur 24h
  - Évolution de la capitalisation

## Technologies Utilisées

- **Frontend** :
  - HTML5 / SCSS
  - JavaScript (ES6+)
  - Bootstrap 5.3
  - Chart.js pour les graphiques
  - Mustache.js pour le templating

- **Build & Development** :
  - Webpack 5
  - Babel
  - PostCSS
  - Sass

- **API** :
  - CoinGecko API v3

## Installation

1. Clonez le repository :
```bash
git clone [url-du-repo]
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez le serveur de développement :
```bash
npm start
```

L'application sera disponible sur `http://localhost:3000`

## Build Production

Pour créer une version de production optimisée :

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.

## Fonctionnalités Principales

### Visualisation des Cryptomonnaies
- Interface claire et intuitive
- Affichage en grid des 100 premières cryptomonnaies
- Cartes interactives avec images et informations de base

### Modal Détaillé
- Vue détaillée pour chaque cryptomonnaie
- Graphiques d'évolution des prix
- Statistiques complètes
- Code couleur pour les variations (vert/rouge)

### Recherche
- Recherche en temps réel
- Résultats présentés dans un tableau clair
- Accès rapide aux détails depuis les résultats

## Configuration

Le projet utilise plusieurs fichiers de configuration :
- `webpack.common.js` : Configuration Webpack commune
- `webpack.dev.js` : Configuration de développement
- `webpack.prod.js` : Configuration de production
- `babel.config.json` : Configuration Babel
- `postcss.config.js` : Configuration PostCSS

## Remerciements

- API fournie par [CoinGecko](https://www.coingecko.com/fr/api)
