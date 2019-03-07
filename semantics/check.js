const { ArrayType } = require('../ast');
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

  hasIntegerType(expression) {
    doCheck(expression.type === IntType, 'Not an integer');
  },

  hasStringType(expression) {
    doCheck(expression.type === StringType, 'Not a string');
  },

};
