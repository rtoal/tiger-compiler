class ArrayExp {
  constructor(type, size, fill) {
    Object.assign(this, { type, size, fill });
  }
}

class ArrayType {
  constructor(memberType) {
    Object.assign(this, { memberType });
  }
}

class Assignment {
  constructor(target, source) {
    Object.assign(this, { target, source });
  }
}

class BinaryExp {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right });
  }
}

class Binding {
  constructor(id, value) {
    Object.assign(this, { id, value });
  }
}

class Break {
}

class Call {
  constructor(callee, args) {
    Object.assign(this, { callee, args });
  }
}

class ExpSeq {
  constructor(exps) {
    Object.assign(this, { exps });
  }
}

class Field {
  constructor(id, type) {
    Object.assign(this, { id, type });
  }
}

class ForExp {
  constructor(index, low, high, body) {
    Object.assign(this, { index, low, high, body });
  }
}

class Func {
  constructor(id, params, returnType, body) {
    Object.assign(this, { id, params, returnType, body });
  }
}

class IdExp {
  constructor(ref) {
    Object.assign(this, { ref });
  }
}

class IfExp {
  constructor(test, consequent, alternate) {
    Object.assign(this, { test, consequent, alternate });
  }
}

class LetExp {
  constructor(decs, body) {
    Object.assign(this, { decs, body });
  }
}

class Literal {
  constructor(value) {
    Object.assign(this, { value });
  }
}

class MemberExp {
  constructor(record, id) {
    Object.assign(this, { record, id });
  }
}

class NegationExp {
  constructor(operand) {
    Object.assign(this, { operand });
  }
}

class Nil {
}

class Param {
  constructor(id, type) {
    Object.assign(this, { id, type });
  }
}

class PrimitiveType {
  constructor(name) {
    Object.assign(this, { name });
  }
}

class RecordExp {
  constructor(type, bindings) {
    Object.assign(this, { type, bindings });
  }
}

class RecordType {
  constructor(fields) {
    Object.assign(this, { fields });
  }
}

class SubscriptedExp {
  constructor(array, subscript) {
    Object.assign(this, { array, subscript });
  }
}

class TypeDec {
  constructor(id, type) {
    Object.assign(this, { id, type });
  }
}

class Variable {
  constructor(id, type, init) {
    Object.assign(this, { id, type, init });
  }
}

class WhileExp {
  constructor(test, body) {
    Object.assign(this, { test, body });
  }
}

module.exports = {
  ArrayExp, ArrayType, Assignment, BinaryExp, Binding, Break, Call, ExpSeq, Field,
  ForExp, Func, IdExp, IfExp, LetExp, Literal, MemberExp, NegationExp, Nil, Param,
  PrimitiveType, RecordExp, RecordType, SubscriptedExp, TypeDec, Variable, WhileExp,
};
