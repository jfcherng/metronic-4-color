/* eslint-env node */

'use strict';

//////////////
// built-in //
//////////////
const path = require('path');
const util = require('util');

//////////////////
// node modules //
//////////////////
const argv = require('yargs').argv;
const Encore = require('@symfony/webpack-encore');

///////////////
// variables //
///////////////
const baseOutputPath = Encore.isProduction() ? 'dist' : 'dev';
const minExt = Encore.isProduction() ? '.min' : '';
const outputPath = argv.outputPath !== undefined ? argv.outputPath : `${baseOutputPath}/`;
const publicPath = argv.publicPath !== undefined ? argv.publicPath : `/${baseOutputPath}`;

let manifestConfig = {
  // sort manifest.json by keys
  sort: (file1, file2) => file1.name.localeCompare(file2.name),
};

/////////////////////////
// prepare directories //
/////////////////////////
mkdirRecursiveSync(outputPath);

////////////////
// Encore env //
////////////////
Encore
  // the project directory where compiled assets will be stored
  .setOutputPath(outputPath)
  // the public path used by the web server to access the previous directory
  .setPublicPath(publicPath)
  .cleanupOutputBeforeBuild()
  .disableSingleRuntimeChunk()
  .enableSourceMaps(!Encore.isProduction())
  // uncomment to create hashed filenames (e.g. app.abc123.css)
  .enableVersioning(false)
  // uncomment if you use Sass/SCSS files
  .enableSassLoader((options) => Object.assign({}, options, {
    // https://github.com/sass/node-sass#options
    includePaths: [
      path.resolve(__dirname, 'node_modules/compass-mixins/lib'),
    ],
    outputStyle: 'expanded',
  }))
  .enablePostCssLoader((options) => Object.assign({}, options, {
    config: {
      // the directory that contains postcss.config.js
      path: path.resolve(__dirname),
    },
  }))
  .configureFilenames({
    js: `[name]${minExt}.js`,
    css: `[name]${minExt}.css`,
    fonts: 'font/[name].[ext]',
    images: 'img/[name].[ext]',
  })
  .configureManifestPlugin((options) => Object.assign({}, options, manifestConfig))
  .addAliases({
    // use '@src' to represent the src directory in require()
    '@src': path.resolve(__dirname, 'src'),
  });

//////////////////
// Encore entry //
//////////////////
Encore
  .addStyleEntry('metronic-4-color', '@src/components/colors.scss')
  .addStyleEntry('metronic-4-color-single-border', '@src/components/colors-single-border.scss');

////////////////////////////////////////
// generate the actual Webpack config //
////////////////////////////////////////
const webpackConfig = Encore.getWebpackConfig();

///////////////////////////////////
// print out full webpack config //
///////////////////////////////////
console.log(util.inspect(webpackConfig, false, null));

module.exports = webpackConfig;

///////////////
// functions //
///////////////
function mkdirRecursiveSync(dir, mode = 0o777) {
  try {
    fs.mkdirSync(dir, mode);
  } catch (e) {
    if (e.code === 'ENOENT') {
      mkdirRecursiveSync(path.dirname(dir), mode);
      mkdirRecursiveSync(dir, mode);
    }
  }
}
