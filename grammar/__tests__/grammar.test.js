/*
 * Grammar Tests
 *
 * These tests check that we’ve constructed our grammar correctly: they
 * invoke the syntax checker for a variety of programs (whatever you’ve)
 * stored in this folder, and expect the syntax checker to return true or
 * false, as appropriate.
 */

const fs = require('fs');
const parse = require('../syntax-checker');

describe('The syntax checker', () => {
  fs.readdirSync(__dirname).forEach((name) => {
    if (name.endsWith('.error.tig')) {
      test(`detects a syntax error in ${name}`, (done) => {
        fs.readFile(`${__dirname}/${name}`, 'utf-8', (err, input) => {
          expect(parse(input)).toBe(false);
          done();
        });
      });
    } else if (name.endsWith('.tig')) {
      test(`matches the program ${name}`, (done) => {
        fs.readFile(`${__dirname}/${name}`, 'utf-8', (err, input) => {
          expect(parse(input)).toBe(true);
          done();
        });
      });
    }
  });
});
