'use strict';
const postcss = require('postcss');
const cssVariables = require('postcss-simple-vars');
const cssConditionals = require('postcss-conditionals');
const cssImport = require('postcss-import');
const cssMixins = require('postcss-sassy-mixins');
const cssNested = require('postcss-nested');
const cssCalc = require('postcss-calc-function').default;
const cssComment = require('postcss-inline-comment');

module.exports = function() {

  //TODO: interpolation, @content, inline calculations

  return postcss()
    .use(cssComment())
    .use(cssImport({
      onImport: (args) => console.log(args)
    }))
    .use(cssMixins())
    .use(cssVariables())
    .use(cssConditionals())
    .use(cssNested())
    .use(cssCalc())

  ;


  //consider: node-css-mqpacker
};