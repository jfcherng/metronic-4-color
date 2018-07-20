/* eslint-env node */

'use strict';

const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  plugins: [
    // https://github.com/csstools/postcss-preset-env
    postcssPresetEnv({
      autoprefixer: {},
    }),
  ],
};
