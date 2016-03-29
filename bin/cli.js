'use strict';
const fs = require('fs');
const chalk = require('chalk');
const compose = require('..');

const file = process.argv[2];

compose(file, fs.readFileSync(file))
  .then(
    result => {

      console.log('RESULT:', result.css, result.messages);

      if (result.messages.length > 0) {
        result.messages.forEach(message => console.error(chalk.red(message.toString())));
        process.exit(-1);
      }

    },
    error => {
      console.error(chalk.red(error));
      process.exit(-1);
    }
)
;