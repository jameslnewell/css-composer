'use strict';
const fs = require('fs');
const composer = require('..');

const file = process.argv[2];

composer()
  .process(fs.readFileSync(file), {from: file})
  .then(
    result => console.log(result.css),
    error => console.log(error)
  )
;