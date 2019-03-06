const fs = require('fs');
const util = require('util');
const parse = require('./ast/parser.js');

console.log(util.inspect(parse(fs.readFileSync(process.argv[2])), {depth: null}));
