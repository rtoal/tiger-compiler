const { ArrayType, FunDec } = require('../ast');
const { IntType, StringType } = require('./builtins');

function doCheck(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
module.exports = {
  isArrayType(type) {
    doCheck(type === ArrayType, 'Not an array type');
  },

  isArray(expression) {
    doCheck(expression.type.constructor === ArrayType, 'Not an array');
  },

  isInteger(expression) {
    doCheck(expression.type === IntType, 'Not an integer');
  },

  isString(expression) {
    doCheck(expression.type === StringType, 'Not a string');
  },

  isIntegerOrString(expression) {
    doCheck(
      expression.type === IntType || expression.type === StringType,
      'Not an integer or string',
    );
  },

  isFunction(value) {
    doCheck(value.constructor === FunDec, 'Not a string');
  },

  typeEquality(type1, type2) {
    return type1 === type2;
  },

  typeCompatibility(expression, type) {
    // Tiger does not have complex rules for type compatibility,
    // though other languages do.
    return expression.type === type;
  },

};
