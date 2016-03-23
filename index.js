'use strict';
const resolve = require('resolve');
const postcss = require('postcss');
const cssVariables = require('postcss-simple-vars');
const cssConditionals = require('postcss-conditionals');
const atImport = require('postcss-import');
const cssMixins = require('postcss-sassy-mixins');
const cssNested = require('postcss-nested');
const cssCalc = require('postcss-calc-function').default;
const inlineComment = require('postcss-inline-comment');

function resolveModule(module, basedir) {
  return new Promise((res, rej) => {

    const options = {
      basedir,
      extensions: ['.scss', '.sass', '.css'],
      packageFilter: pkg => {
        pkg.main = pkg['main.scss'] || pkg['main.sass'] || pkg['main.css'] || pkg['style'];
        return pkg;
      }
    };

    resolve(module, options, (err, path) => {
      if (err) {
        rej(err);
      } else {
        res(path);
      }

    });

  });

  return result;
}

module.exports = function() {

  //TODO: interpolation, inline calculations

  return postcss([
    atImport({resolve: resolveModule})
  ]);


    //.use(inlineComment()) //TODO: currently only works inside rules
    //.use(cssMixins())
    //.use(cssVariables())
    //.use(cssConditionals())
    //.use(cssNested())
    //.use(cssCalc())


  //consider: node-css-mqpacker
};