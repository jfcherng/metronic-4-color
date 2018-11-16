/* eslint-env node */

'use strict';

module.exports = (ctx) => ({
  parser: ctx.file.extname === '.sss' ? 'sugarss' : false,
  plugins: ctx.webpack.mode === 'development' ? {
    // dev mode plugins
  } : {
    // prod mode plugins
    cssnano: {
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
      }],
    },
    'postcss-import': {},
    'postcss-preset-env': {},
  },
});
