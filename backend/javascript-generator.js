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

const beautify = require('js-beautify');
const {
  ArrayExp, Assignment, BinaryExp, Binding, Break, Call, ExpSeq, ForExp, Func,
  IdExp, IfExp, LetExp, Literal, MemberExp, NegationExp, Nil, Param, RecordExp,
  SubscriptedExp, TypeDec, Variable, WhileExp,
} = require('../ast');
const { StringType } = require('../semantics/builtins');

function makeOp(op) {
  return { '=': '===', '<>': '!==', '&': '&&', '|': '||' }[op] || op;
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

// Let's inline the built-in functions, because we can!
const builtin = {
  print([s]) { return `console.log(${s})`; },
  ord([s]) { return `(${s}).charCodeAt(0)`; },
  chr([i]) { return `String.fromCharCode(${i})`; },
  size([s]) { return `${s}.length`; },
  substring([s, i, n]) { return `${s}.substr(${i}, ${n})`; },
  concat([s, t]) { return `${s}.concat(${t})`; },
  not(i) { return `(!(${i}))`; },
  exit(code) { return `process.exit(${code})`; },
};

module.exports = function (exp) {
  return beautify(exp.gen(), { indent_size: 2 });
};

// This only exists because Tiger is expression-oriented and JavaScript is not.
// It's pretty crazy! In the case where the expression is actually a sequence,
// we have to dig in and stick a 'return' before the last expression. And this
// as to be recursive, because the last expression of a sequence could actually
// be a sequence....
function makeReturn(exp) {
  if (!exp) {
    return undefined;
  }
  if (exp.constructor === LetExp) {
    const filteredDecs = exp.decs.filter(d => d.constructor !== TypeDec);
    const all = [...filteredDecs, ...exp.body.slice(0, -1)].map(e => e.gen());
    all.push(makeReturn(exp.body[exp.body.length - 1]));
    return all.join(';');
  }
  if (exp.constructor === ExpSeq) {
    const generated = exp.exps.slice(0, -1).map(e => e.gen());
    generated.push(makeReturn(exp.exps[exp.exps.length - 1]));
    return generated.join(';');
  }
  return `return ${exp.gen()}`;
}

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
  const args = this.args.map(a => a.gen());
  if (this.callee.builtin) {
    return builtin[this.callee.id](args);
  }
  return `${javaScriptId(this.callee)}(${args.join(',')})`;
};

ExpSeq.prototype.gen = function () {
  return this.exps.map(e => e.gen()).join(';');
};

ForExp.prototype.gen = function () {
  const i = javaScriptId(this.index);
  const low = this.low.gen();
  const hi = javaScriptId(new Variable('hi'));
  const preAssign = `${hi} = ${this.high.gen()};`;
  const loopControl = `for (let ${i} = ${low}; ${i} <= ${hi}; ${i}++)`;
  const body = this.body.gen();
  return `${preAssign} ${loopControl} {${body}}`;
};

Func.prototype.gen = function () {
  const name = javaScriptId(this);
  const params = this.params.map(javaScriptId);
  // "Void" functions do not have a JS return, others do
  const body = this.body.type ? makeReturn(this.body) : this.body.gen();
  return `function ${name} (${params.join(',')}) {${body}}`;
};

IdExp.prototype.gen = function () {
  return javaScriptId(this.ref);
};

IfExp.prototype.gen = function () {
  const thenPart = this.consequent.gen();
  const elsePart = this.alternate ? this.alternate.gen() : 'null';
  return `((${this.test.gen()}) ? (${thenPart}) : (${elsePart}))`;
};

LetExp.prototype.gen = function () {
  if (this.type) {
    // This looks insane, but let-expressions really are closures!
    return `(() => {${makeReturn(this)} ; })()`;
  }
  const filteredDecs = this.decs.filter(d => d.constructor !== TypeDec);
  return [...filteredDecs, ...this.body].map(e => e.gen()).join(';');
};

Literal.prototype.gen = function () {
  return this.type === StringType ? `"${this.value}"` : this.value;
};

MemberExp.prototype.gen = function () {
  return `${this.record.gen()}.${this.id}`;
};

SubscriptedExp.prototype.gen = function () {
  return `${this.array.gen()}[${this.subscript.gen()}]`;
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
