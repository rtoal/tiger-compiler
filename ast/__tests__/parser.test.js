/*
 * Parser Tests
 *
 * These tests check that the parser produces the AST that we expect.
 *
 * Note we are only checking ASTs here, so our test programs can, and probably will,
 * have semantic errors.
 */

const parse = require('../parser');

const {
  ArrayExp, ArrayType, Assignment, BinaryExp, Binding, Break, Call, ExpSeq, Field,
  ForExp, Func, IdExp, IfExp, LetExp, Literal, MemberExp, NegationExp, Nil, Param,
  RecordExp, RecordType, SubscriptedExp, TypeDec, Variable, WhileExp,
} = require('../../ast');

const fixture = {
  hello: [
    String.raw`print("Hello, world\n")`,
    new Call('print', [new Literal('Hello, world\\n')]),
  ],

  breaks: [
    String.raw`while 0 do (break; break)`,
    new WhileExp(new Literal(0), new ExpSeq([new Break(), new Break()])),
  ],

  for_and_if: [
    String.raw`for i := 0 to 9 do if i then i := 100`,
    new ForExp(
      'i',
      new Literal(0),
      new Literal(9),
      new IfExp(new IdExp('i'), new Assignment(new IdExp('i'), new Literal(100)), null),
    ),
  ],

  simple_function: [
    String.raw`let
      function addTwo(x: int): int = x + 2
    in
      addTwo(ord("dog"))
    end`,
    new LetExp(
      [new Func('addTwo', [new Param('x', 'int')], 'int',
        new BinaryExp('+', new IdExp('x'), new Literal(2)))],
      [new Call('addTwo', [new Call('ord', [new Literal('dog')])])],
    ),
  ],

  arrays: [
    String.raw`let type list = array of int var x: list := list [1] of -9 in x[0] end`,
    new LetExp(
      [
        new TypeDec('list', new ArrayType('int')),
        new Variable('x', 'list',
          new ArrayExp('list', new Literal(1), new NegationExp(new Literal(9)))),
      ],
      [new SubscriptedExp(new IdExp('x'), new Literal(0))],
    ),
  ],

  records: [
    String.raw`let
      type point = {x: int, y: int}
      var p: point := nil
    in
      print(point{x=1, y=8});
      p.y
    end`,
    new LetExp(
      [
        new TypeDec('point', new RecordType([new Field('x', 'int'), new Field('y', 'int')])),
        new Variable('p', 'point', new Nil()),
      ],
      [
        new Call('print', [new RecordExp(
          'point', [new Binding('x', new Literal(1)), new Binding('y', new Literal(8))],
        )]),
        new MemberExp(new IdExp('p'), 'y'),
      ],
    ),
  ],
};

describe('The parser', () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct AST for ${name}`, (done) => {
      expect(parse(source)).toEqual(expected);
      done();
    });
  });
});
