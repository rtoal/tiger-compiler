/*
 * Grammar Success Test
 *
 * These tests check that our grammar accepts a program that features all of
 * syntactic forms of the language.
 */

const syntaxCheck = require('../syntax-checker');

const program = `
let
  type Circle = {
    x: int,
    y: int,
    color: string
  }
  function fib(n: int): int =
    let
      var a: int := 0
      var b: int := 1
      var t := 0  /* Tiger does not have parallel assignment */
    in
      while n > 0 do
        (t := a; a := b; b := t + b; n := n - 1);
      "abc$%π\\n\\\\\\u{41}";
      a := if 1 then 1;
      b := if 0 then 2 else let var x := 1 in x end;
      b
    end
  var c: Circle := Circle {y = 2, x = 5<3&2<>1, color = "blue"}
  type list = array of string
  var dogs: list := list [3] of "woof"
in
  dogs[1] := "Sparky";
  for i := 1 to 10 do
    print(fib(i) & 0 | 1 + 0 * 1 - 0 / 1)
end
`;

describe('The syntax checker', () => {
  test('accepts the mega program will all syntactic forms', (done) => {
    expect(syntaxCheck(program)).toBe(true);
    done();
  });
});
