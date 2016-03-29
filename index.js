'use strict';
const postcss = require('postcss');
const cssImport = require('./lib/postcss-import-plugin');
const cssInlineComment = require('postcss-inline-comment');
const cssVariables = require('postcss-simple-vars');
const cssConditionals = require('postcss-conditionals');
const cssMixins = require('postcss-sassy-mixins');
const cssNested = require('postcss-nested');
const cssCalc = require('postcss-calc-function').default;

module.exports = function() {

  //TODO: functions (@function, @return), interpolation, inline calculations, @error, @warn

  return postcss([
    cssImport({resolve: {
      packageFilter: pkg => {
        pkg.main = pkg['main.scss'] || pkg['main.sass'] || pkg['main.css'] || pkg['style'];
        return pkg;
      }
    }}),
    //cssInlineComment(), //FIXME: currently only works inside rules
    cssMixins(),
    cssVariables(),
    cssConditionals(),
    cssNested(),
    cssCalc()
  ]);

  //consider: node-css-mqpacker
};