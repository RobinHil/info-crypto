// Forme objet plutot que require() : depuis leurs versions ESM, autoprefixer et
// postcss-nested renvoient un module et non la fonction plugin attendue.
module.exports = {
  plugins: {
    'postcss-nested': {},
    autoprefixer: {},
  },
}
