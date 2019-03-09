const {
  ArrayExp, ArrayType, Assignment, BinaryExp, Break, Call, ExpSeq, Field, FieldBinding,
  ForExp, Func, IdExp, IfExp, LetExp, Literal, MemberExp, NegationExp, Nil, Param,
  RecordExp, RecordType, SubscriptedExp, TypeDec, Variable, WhileExp,
} = require('../ast');

const { IntType, StringType, NilType } = require('./builtins');

const check = require('./check');

ArrayExp.prototype.analyze = function (context) {
  this.type = context.lookupType(this.type);
  check.isArrayType(this.type);
  this.size.analyze(context);
  check.isInteger(this.size);
  this.fill.analyze(context);
  check.typeCompatibility(this.fill, this.type.memberType);
};

ArrayType.prototype.analyze = function (context) {
  this.memberType = context.lookupType(this.memberType);
};

Assignment.prototype.analyze = function (context) {
  this.target.analyze(context);
  this.target.analyze(context);
  check.typeCompatibility(this.source, this.targetType);
};

Break.prototype.analyze = function (context) {
  check.inLoop(context);
};

BinaryExp.prototype.analyze = function (context) {
  this.left.analyze(context);
  this.right.analyze(context);
  if (/[-+*/&|]/.test(this.op)) {
    check.isInteger(this.left);
    check.isInteger(this.right);
  } else if (/<=?|>=?/.test(this.op)) {
    check.typeEquality(this.left, this.right);
    check.isIntegerOrString(this.left);
    check.isIntegerOrString(this.right);
  } else {
    check.typeEquality(this.left, this.right);
  }
  this.type = IntType;
};

Call.prototype.analyze = function (context) {
  this.callee = context.lookupValue(this.callee);
  check.isFunction(this.callee, 'Attempt to call a non-function');
  this.args.forEach(arg => arg.analyze(context));
  check.legalArguments(this.args, this.callee);
  this.type = this.callee.returnType;
};

ExpSeq.prototype.analyze = function (context) {
  this.exps.forEach(e => e.analyze(context));
  if (this.exps.length > 0) {
    this.type = this.exps[this.exps.length - 1].type;
  }
};

Field.prototype.analyze = function (context) {
  this.type = context.lookupType(this.type);
};

FieldBinding.prototype.analyze = function (context) {
  this.value.analyze(context);
};

ForExp.prototype.analyze = function (context) {
  this.low.analyze(context);
  check.isInteger(this.low, 'Low bound in for');
  this.high.analyze(context);
  check.isInteger(this.high, 'High bound in for');
  const bodyContext = context.createChildContextForLoop();
  bodyContext.addVariable(this.id);
  this.body.analyze(bodyContext);
};

Func.prototype.analyze = function (context) {
  const newContext = context.createChildContextForFunctionBody();
  this.params.forEach(p => p.analyze(newContext));
  // Add the function before analyzing the body so that we can support recursion
  context.add(this);
  this.body = this.body.analyze(newContext);
  check.typeCompatibility(this.body, this.returnType, 'Type mismatch in function return');
};

IdExp.prototype.analyze = function (context) {
  this.ref = context.lookupValue(this.ref);
};

IfExp.prototype.analyze = function (context) {
  this.test.analyze(context);
  check.isInteger(this.test, 'Test in if');
  this.consequent.analyze(context);
  if (this.alternate) {
    this.alternate.analyze(context);
  }
};

LetExp.prototype.analyze = function (context) {
  const newContext = context.createChildContextForBlock();
  this.decs.map(d => d.analyze(newContext));
  this.body.map(e => e.analyze(newContext));
  this.type = this.body.type;
};

Literal.prototype.analyze = function () {
  if (typeof this.value === 'number') {
    this.type = IntType;
  } else if (typeof this.value === 'string') {
    this.type = StringType;
  }
};

MemberExp.prototype.analyze = function (context) {
  this.record = this.record.analyze(context);
  const field = this.record.type.getFieldForId(this.id);
  this.type = field.type;
};

NegationExp.prototype.analyze = function (context) {
  this.operand.analyze(context);
  check.isInteger(this.operand, 'Operand of negation');
  this.type = IntType;
};

Nil.prototype.analyze = function () {
  this.type = NilType;
};

Param.prototype.analyze = function (context) {
  this.type = context.lookupType(this.type);
  context.add(this);
};

RecordExp.prototype.analyze = function (context) {
  this.record = this.record.analyze(context);
  check.isRecord(this.record);
  this.record.fieldBindings.forEach((binding) => {
    const field = this.record.type.getFieldForId(binding.id);
    binding.analyze(context);
    check.typeCompatibility(binding.value, field.type);
  });
};

RecordType.prototype.analyze = function (context) {
  const usedFields = new Set();
  this.fields.forEach((field) => {
    check.notDuplicateField(field.id, usedFields);
    usedFields.add(field.id);
    field.analyze(context);
  });
};

RecordType.prototype.getFieldForId = function (id) {
  const field = this.fields.find(f => f.id === id);
  if (field === null) {
    throw new Error('No such field');
  }
  return field;
};

SubscriptedExp.prototype.analyze = function (context) {
  this.array.analyze(context);
  check.isArray(this.array);
  this.subscript.analyze(context);
  check.isInteger(this.subscript);
  this.type = this.array.memberType;
};

TypeDec.prototype.analyze = function (context) {
  this.type = this.type.analyze(context);
  context.addType(this);
};

Variable.prototype.analyze = function (context) {
  this.init.analyze(context);
  if (this.type) {
    this.type = context.lookupType(this.type);
    check.typeCompatibility(this.init, this.type);
  } else {
    // Yay! type inference!
    this.type = this.init.type;
  }
  context.add(this);
};

WhileExp.prototype.analyze = function (context) {
  this.test.analyze(context);
  check.isInteger(this.test, 'Test in while');
  this.body.analyze(context.createChildContextForLoop());
};
