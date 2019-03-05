/*
 * Grammar Tests
 *
 * These tests check that we’ve constructed our grammar correctly: that
 * programs that we expect to be matched by the grammar are matched, and
 * those that we expect not to be matched will cause an error to be thrown.
 */

const fs = require('fs');
const parse = require('../parser');

describe('The grammar', () => {
  fs.readdirSync(__dirname).forEach((name) => {
    if (name.endsWith('.error.tig')) {
      test(`detects a syntax error in ${name}`, (done) => {
        fs.readFile(`${__dirname}/${name}`, 'utf-8', (err, input) => {
          expect(() => parse(input)).toThrow(/Syntax Error/);
          done();
        });
      });
    } else if (name.endsWith('.tig')) {
      test(`matches the program ${name}`, (done) => {
        fs.readFile(`${__dirname}/${name}`, 'utf-8', (err, input) => {
          expect(parse(input)).toBeTruthy();
          done();
        });
      });
    }
  });
});
