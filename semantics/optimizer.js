const {
  ArrayExp,
  Assignment,
  BinaryExp,
  Binding,
  Break,
  Call,
  ExpSeq,
  ForExp,
  Func,
  IdExp,
  IfExp,
  LetExp,
  Literal,
  MemberExp,
  NegationExp,
  Nil,
  Param,
  RecordExp,
  SubscriptedExp,
  TypeDec,
  Variable,
  WhileExp,
} = require('../ast');

module.exports = program => program.optimize();

function isZero(e) {
  return e instanceof Literal && e.value === 0;
}

function isOne(e) {
  return e instanceof Literal && e.value === 1;
}

function bothLiterals(b) {
  return b.left instanceof Literal && b.right instanceof Literal;
}

ArrayExp.prototype.optimize = function() {
  this.size = this.size.optimize();
  this.fill = this.fill.optimize();
  return this;
};

Assignment.prototype.optimize = function() {
  this.target = this.target.optimize();
  this.source = this.source.optimize();
  if (this.target === this.source) {
    return null;
  }
  return this;
};

BinaryExp.prototype.optimize = function() {
  this.left = this.left.optimize();
  this.right = this.right.optimize();
  if (this.op === '+' && isZero(this.right)) return this.left;
  if (this.op === '+' && isZero(this.left)) return this.right;
  if (this.op === '*' && isZero(this.right)) return new Literal(0);
  if (this.op === '*' && isZero(this.left)) return new Literal(0);
  if (this.op === '*' && isOne(this.right)) return this.left;
  if (this.op === '*' && isOne(this.left)) return this.right;
  if (bothLiterals(this)) {
    const [x, y] = [this.left.value, this.right.value];
    if (this.op === '+') return new Literal(x + y);
    if (this.op === '*') return new Literal(x * y);
    if (this.op === '/') return new Literal(x / y);
  }
  return this;
};

Binding.prototype.optimize = function() {
  this.value = this.value.optimize();
  return this;
};

Break.prototype.optimize = function() {
  return this;
};

Call.prototype.optimize = function() {
  this.args = this.args.map(a => a.optimize());
  this.callee = this.callee.optimize();
  return this;
};

ExpSeq.prototype.optimize = function() {
  this.exps = this.exps.map(s => s.optimize());
  if (this.exps.length === 1) {
    return this.exps[0];
  }
  return this;
};

ForExp.prototype.optimize = function() {
  this.low = this.low.optimize();
  this.high = this.high.optimize();
  this.body = this.body.optimize();
  return this;
};

Func.prototype.optimize = function() {
  if (this.body) {
    this.body = this.body.optimize();
  }
  return this;
};

IdExp.prototype.optimize = function() {
  return this;
};

IfExp.prototype.optimize = function() {
  this.test = this.test.optimize();
  this.consequent = this.consequent.optimize();
  this.alternate = this.alternate.optimize();
  if (isZero(this.test)) {
    return this.alternate;
  }
  return this;
};

LetExp.prototype.optimize = function() {
  this.decs = this.decs.filter(d => d.constructor !== TypeDec).map(d => d.optimize());
  this.body = this.body.map(e => e.optimize());
  return this;
};

Literal.prototype.optimize = function() {
  return this;
};

MemberExp.prototype.optimize = function() {
  this.record = this.record.optimize();
  return this;
};

SubscriptedExp.prototype.optimize = function() {
  this.array = this.array.optimize();
  this.subscript = this.subscript.optimize();
  return this;
};

NegationExp.prototype.optimize = function() {
  this.operand = this.operand.optimize();
  if (this.operand instanceof Literal) {
    return new Literal(-this.operand.value);
  }
  return this;
};

Nil.prototype.optimize = function() {
  // Nil is just nil
  return this;
};

Param.prototype.optimize = function() {
  // Nothing to do in Tiger, since it does not have defaults
  return this;
};

RecordExp.prototype.optimize = function() {
  this.bindings = this.bindings.map(e => e.optimize());
  return this;
};

Variable.prototype.optimize = function() {
  this.init = this.init.optimize();
  return this;
};

WhileExp.prototype.optimize = function() {
  this.test = this.test.optimize();
  if (this.test instanceof Literal && !this.test.value) {
    // While-false is a no-operation, don't even need the body
    return new Nil();
  }
  this.body = this.body.optimize();
  return this;
};
