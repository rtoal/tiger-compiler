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

class FieldBinding {
  constructor(id, value) {
    Object.assign(this, { id, value });
  }
}

class ForExp {
  constructor(index, low, high, body) {
    Object.assign(this, {
      index, low, high, body,
    });
  }
}

class Func {
  constructor(id, params, returnType, body) {
    Object.assign(this, {
      id, params, returnType, body,
    });
  }
}

class IdExp {
  constructor(id) {
    Object.assign(this, { id });
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

class NamedType {
  constructor(id) {
    Object.assign(this, { id });
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

class RecordExp {
  constructor(type, fieldBindings) {
    Object.assign(this, { type, fieldBindings });
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
  ArrayExp, ArrayType, Assignment, BinaryExp, Break, Call, ExpSeq, Field,
  FieldBinding, ForExp, Func, IdExp, IfExp, LetExp, Literal, MemberExp,
  NamedType, NegationExp, Nil, Param, RecordExp, RecordType, SubscriptedExp,
  TypeDec, Variable, WhileExp,
};
