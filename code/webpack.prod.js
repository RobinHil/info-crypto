const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [{
      test: /\.(scss|css)$/,
      use: [
        'style-loader',
        { loader: 'css-loader', options: { importLoaders: 3, sourceMap: true }},
        { loader: 'postcss-loader', options: { sourceMap: true }},
        // resolve-url-loader a besoin d'une source map de sass-loader pour
        // reecrire les url() relatives.
        { loader: 'resolve-url-loader', options: { sourceMap: true }},
        // charset: false - sinon Dart Sass prefixe sa sortie d'un BOM des que le CSS
        // contient du non-ASCII. style-loader l'injecte tel quel dans <style>, ou il
        // invalide le premier selecteur (le :root de Bootstrap, donc toutes ses variables).
        { loader: 'sass-loader', options: { sourceMap: true, sassOptions: { charset: false } }}
      ],
    }]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  }
});