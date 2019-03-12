/*
 * Parser Tests
 *
 * These tests check that the parser produces the AST that we expect. The Tiger
 * programs will be in .tig files, and the expected ASTs will be in .ast files.
 */

const fs = require('fs');
const util = require('util');
const parse = require('../parser');

const {
  ArrayExp, ArrayType, Assignment, BinaryExp, Binding, Break, Call, ExpSeq, Field,
  ForExp, Func, IdExp, IfExp, LetExp, Literal, MemberExp, NegationExp, Nil, Param,
  RecordExp, RecordType, SubscriptedExp, TypeDec, Variable, WhileExp,
} = require('../ast');

const fixture = {
  hello: [
    'print("Hello, world\n")',
    new Call('print', new Literal('Hello, world\\n')),
  ],

  add: [
    `let
      function addTwo(x: int): int = x + 2
    in
      addTwo(ord("dog"))
    end`,
    new LetExp(
      [new Func('addTwo', [new Param('x', 'int')], 'int',
        new BinaryExp('+', new IdExp('x'), new Literal(2)))],
      [new Call('addTwo', new Call('ord', [new Literal('dog')]))],
    ),
  ],
};


describe('The parser', () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct AST for ${name}`, (done) => {
      expect(parse(source).toEqual(expected));
      done();
    });
  });
});
