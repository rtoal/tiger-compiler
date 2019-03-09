const { ArrayType, Func } = require('../ast');
const {
  IntType, StringType, NilType, RecordType,
} = require('./builtins');

function doCheck(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
module.exports = {
  // Is this type an array type?
  isArrayType(type) {
    doCheck(type.constructor === ArrayType, 'Not an array type');
  },

  // Is the type of this expression an array type?
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
    doCheck(value.constructor === Func, 'Not a string');
  },

  isFieldOfRecord(id, record) {
    doCheck(record.type.fields.find(field => id === field.id), `No such field: ${id}`);
  },

  // Are two types exactly the same?
  typeEquality(type1, type2) {
    doCheck(type1 === type2, 'Types must match exactly');
  },

  // Can we assign expression to a variable/param/field of type type?
  typeCompatibility(expression, type) {
    doCheck((expression.type === NilType && type.constructor === RecordType)
      || (expression.type === type));
  },

  notDuplicateField(field, usedFields) {
    doCheck(!usedFields.has(field), `Field ${field} already declared`);
  },

  legalArguments() {
    /* TODO */
  },
};
