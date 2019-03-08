/*
 * Translation to JavaScript
 *
 * Requiring this module adds a gen() method to each of the AST classes.
 * Nothing is actually exported from this module.
 *
 * Each gen() method returns a fragment of JavaScript. The gen() method on
 * the program class pretty-prints the complete JavaScript code.
 *
 *   require('./backend/javascript-generator');
 *   program.gen();
 */

const prettyJs = require('pretty-js');

const {
  ArrayExp, ArrayType, Assignment, BinaryExp, Break, Call, ExpSeq, Field,
  FieldBinding, ForExp, FunDec, IdExp, IfExp, LetExp, Literal, MemberExp,
  NamedType, NegationExp, Nil, Param, RecordExp, RecordType, SubscriptedExp,
  TypeDec, VarDec, WhileExp,
} = require('../ast');

const { Context } = require('../semantics/context');

function makeOp(op) {
  return { '=': '===', '<>': '!==' }[op] || op;
}

// javaScriptId(e) takes any PlainScript object with an id property, such as a
// Variable, Parameter, or FunctionDeclaration, and produces a JavaScript
// name by appending a unique identifying suffix, such as '_1' or '_503'.
// It uses a cache so it can return the same exact string each time it is
// called with a particular entity.
const javaScriptId = (() => {
  let lastId = 0;
  const map = new Map();
  return (v) => {
    if (!(map.has(v))) {
      map.set(v, ++lastId); // eslint-disable-line no-plusplus
    }
    return `${v.id}_${map.get(v)}`;
  };
})();

function generateLibraryFunctions() {
  function generateLibraryStub(name, params, body) {
    const entity = Context.INITIAL.declarations[name];
    return `function ${javaScriptId(entity)}(${params}) {${body}}`;
  }
  return [
    generateLibraryStub('print', '_', 'console.log(_);'),
    generateLibraryStub('flush', '_', 'return undefined;'),
    generateLibraryStub('getchar', '_', 'throw new Error("getchar not implemented");'),
    generateLibraryStub('ord', 's', 'return String.fromCharCode(s);'),
    generateLibraryStub('char', 's', 'return s.charCodeAt(0);'),
    generateLibraryStub('size', 's', 'return (s).length;'),
    generateLibraryStub('substring', 's, i, j', 'return (s).substr(i, n);'),
    generateLibraryStub('concat', 's, t', 'return s.concat(t);'),
    generateLibraryStub('not', 's', 'return (!s);'),
    generateLibraryStub('exit', 'code', 'process.exit(code)'),
  ].join('');
}

exports.generateProgram = function (exp) {
  const libraryFunctions = generateLibraryFunctions();
  const program = `${libraryFunctions} (()=>${exp.gen()})();`;
  return prettyJs(program, { indent: '  ' });
};

Object.assign(ArrayExp.prototype, {
  gen() { return `Array(${this.size}).fill(${this.fill})`; },
});

Object.assign(ArrayType.prototype, {
  gen() { /* Empty: types don't generate target code */ },
});

Object.assign(Assignment.prototype, {
  gen() {
    return `${this.target} = ${this.source}`;
  },
});

Object.assign(BinaryExp.prototype, {
  gen() { return `(${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()})`; },
});

Object.assign(Break.prototype, {
  gen() { return 'break'; },
});

Object.assign(Call.prototype, {
  gen() {
    return `${javaScriptId(this.callee)}(${this.args.map(a => a.gen()).join(',')})`;
  },
});

Object.assign(ExpSeq.prototype, {
  gen() { return this.exps.map(s => `${s.gen()};`).join(''); },
});

Object.assign(Field.prototype, {
  gen() { /* Empty: this is part of a type, and types don't generate target code */ },
});

Object.assign(FieldBinding.prototype, {
  gen() { return `${this.id} : ${this.value}`; },
});

Object.assign(ForExp.prototype, {
  gen() { /* TODO */ },
});

Object.assign(FunDec.prototype, {
  gen() { /* TODO */ },
});

Object.assign(IdExp.prototype, {
  gen() { return this.id.gen(); },
});

Object.assign(IfExp.prototype, {
  gen() {
    return `if (${test.gen()}) ${this.consequent()} ${
      this.alternate ? this.alternate.gen() : ''
    }`;
  },
});

Object.assign(LetExp.prototype, {
  gen() { /* TODO */ },
});

Object.assign(Literal.prototype, {
  gen() { return `${this.value}`; },
});

Object.assign(MemberExp.prototype, {
  gen() { /* TODO */ },
});

Object.assign(NamedType.prototype, {
  gen() { /* Empty: types don't generate target code */ },
});

Object.assign(SubscriptedExp.prototype, {
  gen() {
    const base = this.variable.gen();
    const subscript = this.subscript.gen();
    return `${base}[${subscript}]`;
  },
});

Object.assign(NegationExp.prototype, {
  gen() { return `(- (${this.operand.gen()}))`; },
});

Object.assign(Nil.prototype, {
  gen() { return 'null'; },
});

Object.assign(Param.prototype, {
  gen() { return javaScriptId(this); },
});

Object.assign(RecordExp.prototype, {
  gen() { return `{${this.fieldBindings.map(b => b.gen()).join(',')}}`; },
});

Object.assign(RecordType.prototype, {
  gen() { /* Empty: types don't generate target code */ },
});

Object.assign(VarDec.prototype, {
  gen() { return `${javaScriptId(this)} = ${this.init.gen()}`; },
});

Object.assign(IdExp.prototype, {
  gen() { return javaScriptId(this); },
});

Object.assign(TypeDec.prototype, {
  gen() { /* Empty: types don't generate target code */ },
});

Object.assign(WhileExp.prototype, {
  gen() {
    return `while (${this.test.gen()}) { ${this.body.gen()} }`;
  },
});
