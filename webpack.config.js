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
const Encore = require('@symfony/webpack-encore');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

///////////////
// variables //
///////////////
const minExt = Encore.isProduction() ? '.min' : '';

////////////////
// Encore env //
////////////////
Encore
  // the project directory where compiled assets will be stored
  .setOutputPath('dist/')
  // the public path used by the web server to access the previous directory
  .setPublicPath('/dist')
  // .cleanupOutputBeforeBuild()
  // .enableSourceMaps(!Encore.isProduction())
  // uncomment to create hashed filenames (e.g. app.abc123.css)
  // .enableVersioning(Encore.isProduction())
  // uncomment if you use Sass/SCSS files
  .enableSassLoader((options) => {
    // https://github.com/sass/node-sass#options
    Object.assign(options, {
      includePaths: [
        path.resolve(__dirname, './node_modules/compass-mixins/lib'),
      ],
    });
  })
  .enablePostCssLoader((options) => {
    Object.assign(options, {
      config: {
        path: path.resolve(__dirname, './postcss.config.js'),
      },
    });
  });

//////////////////
// Encore entry //
//////////////////
Encore.addStyleEntry('metronic-4-color' + minExt, './src/_main.scss');

///////////////////////////////////
// add custom production plugins //
///////////////////////////////////
if (Encore.isProduction()) {
  Encore
    .addPlugin(new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.(c|s[ac])ss$/g,
      cssProcessorOptions: {
        safe: true,
        discardComments: {
          removeAll: true,
        },
      },
      canPrint: true,
    }));
}

////////////////////////////////////////
// generate the actual Webpack config //
////////////////////////////////////////
const config = Encore.getWebpackConfig();

///////////////////////////
// print out full config //
///////////////////////////
console.log(util.inspect(config, false, null));

module.exports = config;
