'use strict';
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const parser = require('postcss-value-parser');
const resolveAlgorithm = require('resolve');

/**
 * Differences to postcss-import:
 * - stricter adherance to node style imports
 * - error by default on missing import
 * - allow imports anywhere in a file - like SASS
 * - doesn't resolve imports in @media rules
 * TODO: skip http(s):// imports
 */

module.exports = postcss.plugin('postcss-node-import', options => {
  return (rootNode, rootResult) => {

    const walkImportRules = node => {
      const processedImportRules = [];

      node.walkAtRules('import', rule => {
        processedImportRules.push(
          parseImportRule(rule)
            .then(resolveImportModule)
            .then(loadImportModule)
            .then(parseImportModule)
            .then(node => {
              rule.replaceWith(node);
            })
        );
      });

      return Promise.all(processedImportRules)
        .then(() => node)
      ;
    };

    const parseImportRule = rule => {

      //check the rule has no children
      if (rule.nodes) {
        throw rule.error('Incorrect `@import` syntax');
      }

      //parse the rule parameters
      const data = parser(rule.params);

      //check the rule has a single string parameter
      if (data.nodes.length === 0 || data.nodes[0].type !== 'string') {
        throw rule.error('Incorrect `@import` syntax');
      }

      return Promise.resolve({
        module: data.nodes[0].value,
        basedir: path.dirname(rule.source.input.file)
      });
    };

    const resolveImportModule = meta => {

      if (typeof options.resolve === 'function') {

        return Promise.resolve(options.resolve(
          meta.module,
          meta.basedir
        ));

      } else {

        const resolveOptions = Object.assign(
          {
            basedir: meta.basedir,
            extensions: ['.scss', '.sass', '.css']
          },
          options.resolve
        );

        return new Promise((resolve, reject) => {
          resolveAlgorithm(meta.module, resolveOptions, (firstError, file) => {
            if (firstError) {

              //warn the user if they tried to @import '${module}' but might have meant './${module}'
              resolveAlgorithm('./' + meta.module, resolveOptions, (secondError, file) => {
                if (secondError) {
                  reject(firstError);
                } else {
                  reject(new Error(`Cannot find module '${meta.module}' from '${meta.basedir}'. Did you mean '${'./' + meta.module}'?`))
                }
              });

            } else {
              resolve(file);
            }
          });

        });
      }

    };

    const loadImportModule = file => {
      return new Promise(function (resolve, reject) {
        fs.readFile(file, (err, buffer) => {
          if (err) return reject(err);
          resolve({file, contents: buffer.toString()});
        });
      });
    };

    const parseImportModule = data => {

      return postcss().process(data.contents, {
        from: data.file,
        syntax: rootResult.opts.syntax,
        parser: rootResult.opts.parser
      })
        .then(result => walkImportRules(result.root))
      ;

      //recursively replace import rules
      //return walkImportRules(node);
    };

    return walkImportRules(rootNode);
  };
});
