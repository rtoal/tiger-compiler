/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require('../../ast/parser');
const analyze = require('../analyzer');

// This is just enough to complete 100% analyzer coverage, but feels light to me.
const program = String.raw`
let
  type Circle = {
    x: int,
    y: int,
    color: string
  }
  type list = array of string
  var two := successor(1) /* Test forward use, yay */
  var c: Circle := Circle {y = 2, x = 5<3&2<>1, color = "blue"}
  var dogs: list := list [3] of "woof"
  function successor(x: int): int = x + 1
in
  dogs[1] := "Sparky";
  if "a" < "b" then ();
  if c = c then print("") else print("z");
  while 1 do break;
  c.x := if 1 then 2 else 3;
  for i := 1 to (9; 10) do
    print(concat(chr(-2), "xyz"));
  let var x := 1 in end
end
`;

describe('The semantic analyzer', () => {
  test('accepts the mega program with all syntactic forms', done => {
    const astRoot = parse(program);
    expect(astRoot).toBeTruthy();
    analyze(astRoot);
    expect(astRoot).toBeTruthy();
    done();
  });
});
