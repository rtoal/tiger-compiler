/*
 * Parser Tests
 *
 * These tests check that the parser produces the AST that we expect. The Tiger
 * programs will be in .tig files, and the expected ASTs will be in .ast files.
 */

const fs = require('fs');
const util = require('util');
const parse = require('../parser');

describe('The parser', () => {
  fs.readdirSync(__dirname).forEach((name) => {
    if (name.endsWith('.tig')) {
      test(`produces the correct AST for ${name}`, (done) => {
        fs.readFile(`${__dirname}/${name}`, 'utf-8', (err, input) => {
          const ast = parse(input);
          const astText = util.inspect(ast, { depth: null });
          fs.readFile(`${__dirname}/${name.slice(0, -3)}ast`, 'utf-8', (_err, expected) => {
            expect(astText).toEqual(expected.trim());
            done();
          });
        });
      });
    }
  });
});
