const postcss = require('postcss');

module.exports = postcss.plugin('postcss-scss-function', options => {
  return (rootNode, rootResult) => {

    //https://github.com/andyjansson/postcss-functions/blob/master/index.js
    rootNode.walk(node => {
      switch (node.type) {

        case 'atrule':
          return; //look for function defintion

        case 'decl':
          return; //function usage

      }
    });

  };
});
