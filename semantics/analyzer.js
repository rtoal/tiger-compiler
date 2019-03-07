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
  check.hasIntegerType(this.size);
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
  this.callee = context.resolveFunction(this.callee);
  this.args = this.args.map(arg => arg.analyze(context));
  check.legalArguments(this.args, this.callee);
};

ExpSeq.prototype.analyze = function (context) {
  this.exps = this.exps.map(e => e.analyze(context));
};

Field.prototype.analyze = function (/* context */) {
  /* TODO */
};

FieldBinding.prototype.analyze = function (/* context */) {
  /* TODO */
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

FunDec.prototype.analyze = function (/* context */) {
  /* TODO */
};

IdExp.prototype.analyze = function (context) {
  this.id = context.resolve(this.id);
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
  check.typeHasBeenDeclared(context);
};

NegationExp.prototype.analyze = function (context) {
  this.operand = this.operand.analyze(context);
  check.isInteger(this.operand, 'Operand of negation');
  this.type = IntType;
};

Nil.prototype.analyze = function () {
  this.type = NilType;
};

Param.prototype.analyze = function (/* context */) {
  /* TODO */
};

RecordExp.prototype.analyze = function (/* context */) {
  /* TODO */
};

RecordType.prototype.analyze = function (/* context */) {
  /* TODO */
};

SubscriptedExp.prototype.analyze = function (/* context */) {
  /* TODO */
};

TypeDec.prototype.analyze = function (/* context */) {
  /* TODO */
};

VarDec.prototype.analyze = function (/* context */) {
  /* TODO */
};

WhileExp.prototype.analyze = function (context) {
  this.test = this.test.analyze(context);
  check.isInteger(this.test, 'Test in while');
  this.body = this.body.analyze(context.with({ inLoop: true }));
};
