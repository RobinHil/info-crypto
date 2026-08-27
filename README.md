# InfoCrypto

A web app that tracks cryptocurrencies in real time using the public
[CoinGecko](https://www.coingecko.com/en/api) API: a grid of the top 100 coins by
market capitalization, a searchable index of every listed coin, and a detail view
with 24-hour and 30-day price charts.

## Features

- The top 100 coins by market cap, refreshed automatically every minute.
- Search across the whole CoinGecko index, with direct access to any result.
- A detail modal per coin: current price, 24-hour change, market cap rank,
  circulating / total / maximum supply, and two interactive price charts
  (24 hours and 30 days).

## Stack

- JavaScript (ES6+), SCSS, Bootstrap 5.3
- Chart.js for the charts, Mustache.js for templating
- Webpack 5, Babel 8, PostCSS, Sass

## Running it

Requires Node.js 24 (the current LTS); see `code/.nvmrc`. All the source
lives in `code/`.

```bash
cd code
npm install
npm start          # development server on http://localhost:3000
npm run build      # production build in dist/
```

`dist/` is a plain static bundle: copy it to any web server, no runtime needed.

## About the API

The app calls the free public CoinGecko endpoints, with no API key. That tier is
rate limited to roughly 5 to 15 calls per minute per IP address; beyond that the
API answers `429` and the affected view stays empty until the next refresh. If
you need more headroom, add a demo key to the request URLs as the
`x_cg_demo_api_key` query parameter.

## Layout

```
code/
  src/
    scripts/      app.js (views, search, modals), crypto.js (API client),
                  cryptoCharts.js (Chart.js price charts)
    templates/    Mustache templates: page, card, search modal, coin modal
    stylesheets/  styles.scss
  webpack.common.js / webpack.dev.js / webpack.prod.js
```

## Credits

Market data from [CoinGecko](https://www.coingecko.com/en/api).
