const { FunDec, Param, NamedType } = require('../ast');

const IntType = new NamedType('int');
const StringType = new NamedType('string');
class NilType {}

const standardFunctions = [
  new FunDec('print', [new Param('s', StringType)]),
  new FunDec('flush', []),
  new FunDec('getchar', [], StringType),
  new FunDec('ord', [new Param('s', StringType)], IntType),
  new FunDec('chr', [new Param('x', IntType)], StringType),
  new FunDec('size', [new Param('s', StringType)], IntType),
  new FunDec('substring', [
    new Param('s', StringType),
    new Param('first', IntType),
    new Param('n', IntType),
  ], StringType),
  new FunDec('concat', [
    new Param('s', StringType),
    new Param('t', StringType),
  ], StringType),
  new FunDec('not', [new Param('x', IntType)], IntType),
  new FunDec('exit', [new Param('code', IntType)]),
];

module.exports = {
  IntType, StringType, NilType, standardFunctions,
};
