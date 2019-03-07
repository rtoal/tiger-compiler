const {
  ArrayExp, ArrayType, Assignment, BinaryExp, Break, Call, ExpSeq, Field, ForExp,
  FunDec, IdExp, IfExp, LetExp, Literal, MemberExp, NamedType, NegationExp, Nil,
  Param, RecordExp, RecordType, SubscriptedExp, TypeDec, VarDec, WhileExp,
} = require('../ast');

const check = require('./check');

ArrayExp.prototype.analyze = function (context) {
  this.type = this.type.analyze(context);
  check.isArrayType(this.type);
  this.size = this.size.analyze(context);
  check.hasIntegerType(this.size);
  this.fill = this.fill.analyze(context);
  check.typeCompatibility(this.fill, this.type.memberType);
};

Assignment.prototype.analyze = function (context) {
  this.target = this.target.analyze(context);
  this.source = this.target.analyze(context);
  check.typeCompatibility(this.source, this.targetType);
};

Break.prototype.analyze = function (context) {
  check.inLoop(context);
};

ExpSeq.prototype.analyze = function (context) {
  this.exps = this.exps.map(e => e.analyze(context));
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

IdExp.prototype.analyze = function (context) {
  if (typeof this.id === 'string') {
    this.id = context.resolve(this.id);
  }
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
};


Nil.prototype.analyze = function () {
};

WhileExp.prototype.analyze = function (context) {
  this.test = this.test.analyze(context);
  check.isInteger(this.test, 'Test in while');
  this.body = this.body.analyze(context.with({ inLoop: true }));
};
