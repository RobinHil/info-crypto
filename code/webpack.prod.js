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
        { loader: 'sass-loader', options: { sourceMap: true }}
      ],
    }]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  }
});