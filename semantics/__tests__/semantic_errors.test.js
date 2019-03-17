/*
 * Semantic Error Tests
 *
 * These tests check that the analyzer will reject programs with various
 * static semantic errors.
 */

const parse = require('../../ast/parser');
const Context = require('../context');

const errors = [
  ['non integer while condition', 'while "hello" do nil'],
  ['non integer if condition', 'if "hello" then nil'],
  ['non integer in add', '3 + "dog"'],
  ['non integer in subtract', '"dog" - 5'],
  ['types do not match in equality test', '2 = "dog"'],
  ['types do not match in inequality test', '2 <> "dog"'],
  ['use of undeclared variable', 'x := 1'],
  ['undeclared because in other scope', 'let var x := 1 in let var y := 2 in 1 end; y end'],
  ['redeclaration of variable', 'let var x := 1 var x := 2 in nil end'],
  ['writing to for loop index', 'for i := 0 to 10 do i := 3'],
  ['too many function arguments', 'char(1, 2, 3)'],
  ['too few function arguments', 'concat("x")'],
  ['wrong type of function argument', 'ord(8)'],
  // TODO: We need dozens more here....
];

describe('The semantic analyzer', () => {
  errors.forEach(([scenario, program]) => {
    test(`detects the error ${scenario}`, (done) => {
      const astRoot = parse(program);
      expect(astRoot).toBeTruthy();
      expect(() => astRoot.analyze(Context.INITIAL)).toThrow();
      done();
    });
  });
});
