/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require('../../ast/parser');
const Context = require('../context');

// TODO THIS IS NOT DONE!!!!!

const program = String.raw`
let
  type Circle = {
    x: int,
    y: int,
    color: string
  }
  type list = array of string
  var c: Circle := Circle {y = 2, x = 5<3&2<>1, color = "blue"}
  var dogs: list := list [3] of "woof"
in
  dogs[1] := "Sparky";
  for i := 1 to 10 do
    print(concat(chr(2), "xyz"))
    /*
     *
     * NEEDS A ZILLION MORE THINGS
     *
     */
end
`;

describe('The semantic analyzer', () => {
  test('accepts the mega program with all syntactic forms', (done) => {
    const astRoot = parse(program);
    expect(astRoot).toBeTruthy();
    astRoot.analyze(Context.INITIAL);
    expect(astRoot).toBeTruthy();
    done();
  });
});
