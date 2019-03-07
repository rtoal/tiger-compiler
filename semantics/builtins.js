class IntType {}
class StringType {}
class NilType {}

const { FunDec, Param } = require('../ast');

const standardFunctions = [
  new FunDec('print', [new Param('s', 'string')]),
  new FunDec('flush', []),
  new FunDec('getchar', [], 'string'),
  new FunDec('ord', [new Param('s', 'string')], 'int'),
  new FunDec('chr', [new Param('x', 'int')], 'string'),
  new FunDec('size', [new Param('s', 'string')], 'int'),
  new FunDec('substring', [
    new Param('s', 'string'),
    new Param('first', 'int'),
    new Param('n', 'int'),
  ], 'string'),
  new FunDec('concat', [
    new Param('s', 'string'),
    new Param('t', 'string'),
  ], 'string'),
  new FunDec('not', [new Param('x', 'int')], null),
  new FunDec('exit', [new Param('code', 'int')], null),
];

module.exports = {
  IntType, StringType, NilType, standardFunctions,
};
