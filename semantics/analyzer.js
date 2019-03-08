const {
  ArrayExp, ArrayType, Assignment, BinaryExp, Break, Call, ExpSeq, Field,
  FieldBinding, ForExp, FunDec, IdExp, IfExp, LetExp, Literal, MemberExp,
  NamedType, NegationExp, Nil, Param, RecordExp, RecordType, SubscriptedExp,
  TypeDec, VarDec, WhileExp,
} = require('../ast');

const { IntType, StringType, NilType } = require('./builtins');

const check = require('./check');

ArrayExp.prototype.analyze = function (context) {
  this.type = this.type.analyze(context);
  check.isArrayType(this.type);
  this.size = this.size.analyze(context);
  check.isInteger(this.size);
  this.fill = this.fill.analyze(context);
  check.typeCompatibility(this.fill, this.type.memberType);
};

ArrayType.prototype.analyze = function (context) {
  this.memberType = this.memberType.analyze(context);
};

Assignment.prototype.analyze = function (context) {
  this.target = this.target.analyze(context);
  this.source = this.target.analyze(context);
  check.typeCompatibility(this.source, this.targetType);
};

Break.prototype.analyze = function (context) {
  check.inLoop(context);
};

BinaryExp.prototype.analyze = function (context) {
  this.left = this.left.analyze(context);
  this.right = this.right.analyze(context);
  if (/[-+*/&|]/.test(this.op)) {
    check.isInteger(this.left);
    check.isInteger(this.right);
    this.type = IntType;
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
  this.args = this.args.map(arg => arg.analyze(context));
  check.legalArguments(this.args, this.callee);
};

ExpSeq.prototype.analyze = function (context) {
  this.exps = this.exps.map(e => e.analyze(context));
};

Field.prototype.analyze = function (context) {
  this.type = this.type.analyze(context);
};

FieldBinding.prototype.analyze = function (context) {
  this.type = this.type.analyze(context);
};

ForExp.prototype.analyze = function (context) {
  this.low = this.test.analyze(context);
  check.isInteger(this.low, 'Low bound in for');
  this.high = this.test.analyze(context);
  check.isInteger(this.high, 'High bound in for');
  const bodyContext = context.createChildContext();
  bodyContext.addVariable(this.id);
  bodyContext.inLoop = true;
  this.body = this.body.analyze(bodyContext);
};

FunDec.prototype.analyze = function (context) {
  const newContext = context.createChildContextForFunctionBody();
  this.params.forEach(p => p.analyze(newContext));
  context.add(this);
  if (this.body) {
    this.body = this.body.analyze(newContext);
  }
};

IdExp.prototype.analyze = function (context) {
  this.id = context.lookupValue(this.id);
};

IfExp.prototype.analyze = function (context) {
  this.test = this.test.analyze(context);
  check.isInteger(this.test, 'Test in if');
  this.consequent = this.consequent.analyze(context);
  if (this.alternate) {
    this.alternate = this.alternate.analyze(context);
  }
};

LetExp.prototype.analyze = function (context) {
  const newContext = context.createChildContext();
  this.decs = this.decs.map(d => d.analyze(newContext));
  this.body = this.body.map(e => e.analyze(newContext));
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
  check.isField(this.record, this.id);
};

NamedType.prototype.analyze = function (context) {
  if (this.id === 'int') {
    return IntType;
  }
  if (this.id === 'string') {
    return StringType;
  }
  return context.lookupType(this.id);
};

NegationExp.prototype.analyze = function (context) {
  this.operand = this.operand.analyze(context);
  check.isInteger(this.operand, 'Operand of negation');
  this.type = IntType;
};

Nil.prototype.analyze = function () {
  this.type = NilType;
};

Param.prototype.analyze = function (context) {
  this.type = this.type.analyze(context);
  context.add(this);
};

RecordExp.prototype.analyze = function (context) {
  this.record = this.record.analyze(context);
  check.isRecord(this.record);
  this.record.fieldBindings.forEach((binding) => {
    const field = this.record.fields.find(f => f.id === binding.id);
    if (field === null) {
      throw new Error('No such field');
    }
    binding.value.analyze(context);
    check.typeCompatibility(binding.value, field.type);
  });
};

RecordType.prototype.analyze = function (context) {
  // this.fields.forEach(field => field.analyze(context));
  // this.fields.forEach(...this.)
};

SubscriptedExp.prototype.analyze = function (context) {
  this.array = this.array.analyze(context);
  check.isArray(this.array);
  this.subscript = this.subscript.analyze(context);
  check.isInteger(this.subscript);
};

TypeDec.prototype.analyze = function (context) {
  this.type = this.type.analyze(context);
  context.add(this);
};

VarDec.prototype.analyze = function (context) {
  this.init = this.init.analyze(context);
  if (this.type) {
    this.type = this.type.analyze(context);
    check.typeCompatibility(this.init, this.type);
  } else {
    this.type = this.init.type;
  }
  context.add(this);
};

WhileExp.prototype.analyze = function (context) {
  this.test = this.test.analyze(context);
  check.isInteger(this.test, 'Test in while');
  this.body = this.body.analyze(context.with({ inLoop: true }));
};
