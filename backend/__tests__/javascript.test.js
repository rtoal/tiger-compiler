/*
 * JavaScript Code Generator Tests
 *
 * These tests check that the JavaScript generator produces the target
 * JavaScript that we expect.
 */

const parse = require('../../ast/parser');
const analyze = require('../../semantics/analyzer');
const generate = require('../javascript-generator');

const fixture = {
  hello: [
    String.raw`print("Hello, world\n")`,
    String.raw`console.log("Hello, world\n")`,
  ],

  arithmetic: [
    String.raw`5 * -2 + 8`,
    String.raw`((5 * (-(2))) + 8)`,
  ],

  letAndAssign: [
    String.raw`let var x := 3 in x := 2 end`,
    /let x_(\d+) = 3;\s+x_\1 = 2/,
  ],

  call: [
    String.raw`let function f(x: int, y: string) = () in f(1, "") end`,
    /function f_(\d+)\(x_\d+, y_\d+\) \{\s*};\s*f_\1\(1, ""\)/,
  ],

  whileLoop: [
    String.raw`while 7 do nil`,
    /while \(7\) \{\s*null\s*\}/,
  ],

  forLoop: [
    String.raw`for i := 0 to 10 do ()`,
    /let hi_(\d+) = 10;\s*for \(let i_(\d+) = 0; i_\2 <= hi_\1; i_\2\+\+\) \{\s*\}/,
  ],

  ifThen: [
    String.raw`if 3 then 5`,
    '((3) ? (5) : (null))',
  ],

  ifThenElse: [
    String.raw`if 3 then 5 else 8`,
    '((3) ? (5) : (8))',
  ],

  member: [
    String.raw`let type r = {x:string} var p := r{x="@"} in print(p.x) end`,
    /let p_(\d+) = \{\s*x: "@"\s*\};\s*console.log\(p_\1\.x\)/,
  ],

  subscript: [
    String.raw`let type r = array of string var a := r[3] of "" in print(a[0]) end`,
    /let a_(\d+) = Array\(3\).fill\(""\);\s*console.log\(a_\1\[0\]\)/,
  ],

  letInFunction: [
    String.raw`let function f():int = let var x:= 1 in x end in () end`,
    /function f_(\d+)\(\) \{\s*let x_(\d+) = 1;\s*return x_\2\s*\};/,
  ],

  letAsValue: [
    String.raw`print(let var x := "dog" in concat(x, "s") end)`,
    /console.log\(\(\(\) => \{\s*let x_(\d+) = "dog";\s*return x_\1.concat\("s"\);\s*\}\)\(\)\)/,
  ],
};

describe('The JavaScript generator', () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct output for ${name}`, (done) => {
      const ast = parse(source);
      analyze(ast);
      expect(generate(ast)).toMatch(expected);
      done();
    });
  });
});
