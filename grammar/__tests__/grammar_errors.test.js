/*
 * Grammar Error Tests
 *
 * These tests check that our grammar will reject programs with various
 * syntax errors.
 */

const syntaxCheck = require('../syntax-checker');

const errors = [
  ['keyword as id', 'else := 5'],
  ['unclosed paren', 'let var x := (2 * 3 in end'],
  ['unknown operator', 'x := 2 ** 5'],
  ['chained relational operators', '1 < 3 < 5'],
  ['unclosed comment', 'x := /*   hello 9'],
  ['bad unicode escape', '"ab\\u{1f4%a9}c"'],
  ['bad escape', '"ab\\q"'],
  ['bad character in id', '$x := 1'],
  // TODO: We need dozens more here....
];

describe('The syntax checker', () => {
  errors.forEach(([scenario, program]) => {
    test(`detects the error ${scenario}`, (done) => {
      expect(syntaxCheck(program)).toBe(false);
      done();
    });
  });
});
