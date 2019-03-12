/*
 * Translation to JavaScript
 *
 * Requiring this module adds a gen() method to each of the AST classes, except
 * for types, and fields, which don’t figure into code generation. It exports a
 * function that generates a complete, pretty-printed JavaScript program for a
 * Tiger expression, bundling the translation of the Tiger standard library with
 * the expression's translation.
 *
 * Each gen() method returns a fragment of JavaScript.
 *
 *   const generate = require('./backend/javascript-generator');
 *   generate(tigerExpression);
 */

const prettyJs = require('pretty-js');

const {
  ArrayExp, Assignment, BinaryExp, Binding, Break, Call, ExpSeq, ForExp, Func,
  IdExp, IfExp, LetExp, Literal, MemberExp, NegationExp, Nil, Param, RecordExp,
  SubscriptedExp, TypeDec, Variable, WhileExp,
} = require('../ast');

const Context = require('../semantics/context');
const { StringType } = require('../semantics/builtins');

function makeOp(op) {
  return { '=': '===', '<>': '!==' }[op] || op;
}

// javaScriptId(e) takes any Tiger object with an id property, such as a Variable,
// Param, or Func, and produces a JavaScript name by appending a unique identifying
// suffix, such as '_1' or '_503'. It uses a cache so it can return the same exact
// string each time it is called with a particular entity.
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
    const entity = Context.INITIAL.valueMap[name];
    return `function ${javaScriptId(entity)}(${params}) {${body}}`;
  }
  return [
    generateLibraryStub('print', 's', 'console.log(s);'),
    generateLibraryStub('flush', '', 'return undefined;'),
    generateLibraryStub('getchar', '', 'throw new Error("getchar not implemented");'),
    generateLibraryStub('ord', 's', 'return s.charCodeAt(0);'),
    generateLibraryStub('chr', 'i', 'return String.fromCharCode(i);'),
    generateLibraryStub('size', 's', 'return s.length;'),
    generateLibraryStub('substring', 's, i, j', 'return s.substr(i, n);'),
    generateLibraryStub('concat', 's, t', 'return s.concat(t);'),
    generateLibraryStub('not', 's', 'return !s;'),
    generateLibraryStub('exit', 'code', 'process.exit(code);'),
  ].join('');
}

module.exports = function (exp) {
  const libraryFunctions = generateLibraryFunctions();
  const program = `${libraryFunctions} ${exp.gen()}`;
  return prettyJs(program, { indent: '  ' });
};

ArrayExp.prototype.gen = function () {
  return `Array(${this.size.gen()}).fill(${this.fill.gen()})`;
};

Assignment.prototype.gen = function () {
  return `${this.target.gen()} = ${this.source.gen()}`;
};

BinaryExp.prototype.gen = function () {
  return `(${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()})`;
};

Binding.prototype.gen = function () {
  return `${this.id} : ${this.value.gen()}`;
};

Break.prototype.gen = function () {
  return 'break';
};

Call.prototype.gen = function () {
  return `${javaScriptId(this.callee)}(${this.args.map(a => a.gen()).join(',')})`;
};

ExpSeq.prototype.gen = function () {
  return this.exps.map(s => `${s.gen()};`).join('');
};

ForExp.prototype.gen = function () {
  const i = javaScriptId(this.index);
  const low = this.low.gen();
  const hi = javaScriptId(new Variable('hi'));
  const body = this.body.gen();
  return `${hi} = ${this.high.gen()}; for (let ${i} = ${low}; ${i} <= ${hi}; ${i}++) {${body}}`;
};

Func.prototype.gen = function () {
  const name = javaScriptId(this);
  const params = this.params.map(javaScriptId);
  return `function ${name} (${params.join(',')}) {${this.body.gen()}}`;
};

IdExp.prototype.gen = function () {
  return javaScriptId(this.ref);
};

IfExp.prototype.gen = function () {
  const thenPart = this.consequent;
  const elsePart = this.alternate ? this.alternate.gen() : '';
  return `if (${test.gen()}) ${thenPart} ${elsePart}`;
};

LetExp.prototype.gen = function () {
  const decs = this.decs.filter(d => d.constructor !== TypeDec);
  return `{ ${decs.map(d => d.gen()).join(';')} ; ${this.body.map(e => e.gen()).join(';')} }`;
};

Literal.prototype.gen = function () {
  return this.type === StringType ? `"${this.value}"` : this.value;
};

MemberExp.prototype.gen = function () {
  return `${this.record.gen()}.${javaScriptId(this)}`;
};

SubscriptedExp.prototype.gen = function () {
  const base = this.array.gen();
  const subscript = this.subscript.gen();
  return `${base}[${subscript}]`;
};

NegationExp.prototype.gen = function () {
  return `(- (${this.operand.gen()}))`;
};

Nil.prototype.gen = function () {
  return 'null';
};

Param.prototype.gen = function () {
  return javaScriptId(this);
};

RecordExp.prototype.gen = function () {
  return `{${this.bindings.map(b => b.gen()).join(',')}}`;
};

Variable.prototype.gen = function () {
  return `let ${javaScriptId(this)} = ${this.init.gen()}`;
};

WhileExp.prototype.gen = function () {
  return `while (${this.test.gen()}) { ${this.body.gen()} }`;
};
