'use strict';
const postcss = require('postcss');
const parser = require('postcss-scss');

const cssImport = require('./lib/postcss-node-import');
const cssStripInlineComments = require('postcss-strip-inline-comments');
const cssVariables = require('postcss-simple-vars');
const cssConditionals = require('postcss-conditionals');
const cssMixins = require('postcss-sassy-mixins');
const cssNested = require('postcss-nested');
const cssCalc = require('postcss-calc-function').default;
const cssFunctions = require('./lib/postcss-scss-function');

module.exports = function(file, contents) {

  //TODO: functions (@function, @return), interpolation, inline calculations, @error, @warn

  const processor = postcss([
    cssImport({resolve: {
      packageFilter: pkg => {
        pkg.main = pkg['main.scss'] || pkg['main.sass'] || pkg['main.css'] || pkg['style'];
        return pkg;
      }
    }}),
    cssStripInlineComments(),
    cssFunctions(),
    //cssMixins(),
    //cssVariables(),
    //cssConditionals(),
    //cssNested(),
    //cssCalc()
  ]);

  return processor.process(contents, {from: file, parser});

  //consider: node-css-mqpacker
};