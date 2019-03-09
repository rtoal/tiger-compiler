/*
 * Semantic Analysis Context
 *
 * A context object holds state for the semantic analysis phase.
 *
 *   const Context = require('./semantics/context');
 */

const {
  standardFunctions, IntType, StringType, NilType,
} = require('./builtins');

require('./analyzer');

// When doing semantic analysis we pass around context objects.
//
// A context object holds:
//
//   1. A reference to the parent context (or null if this is the root context).
//      This allows to search for declarations from the current context outward.
//
//   2. A reference to the current function we are analyzing, if any. If we are
//      inside a function, then return expressions are legal, and we will be
//      able to type check them.
//
//   3. Whether we are in a loop (to know that a `break` is okay).
//
//   4. A map for looking up types declared in this context.
//
//   5. A map for looking up vars and functions declared in this context.
//
// The reason for the two maps is that in Tiger, types are kept in a separate
// namespace from all of the variables and functions. So you could declare a
// type called "list" and a variable called "list" in the same scope. But you
// probably shouldn't.

class Context {
  constructor({ parent = null, currentFunction = null, inLoop = false } = {}) {
    Object.assign(this, {
      parent,
      currentFunction,
      inLoop,
      typeMap: Object.create(null),
      valueMap: Object.create(null),
    });
  }

  createChildContextForFunctionBody(currentFunction) {
    // When entering a new function, we're not in a loop anymore
    return new Context({ parent: this, currentFunction, inLoop: false });
  }

  createChildContextForLoop() {
    // When entering a loop body, just set the inLoop field, retain others
    return new Context({ parent: this, currentFunction: this.currentFunction, inLoop: true });
  }

  createChildContextForBlock() {
    // For a block, we have to retain both the function and loop settings.
    return new Context({
      parent: this,
      currentFunction: this.currentFunction,
      inLoop: this.inLoop,
    });
  }

  // Adds a variable or function to this context.
  add(entity) {
    if (entity.id in this.valueMap) {
      throw new Error(`${entity.id} already declared in this scope`);
    }
    this.valueMap[entity.id] = entity;
  }

  addType(typeDec) {
    if (typeDec.id in this.typeMap) {
      throw new Error(`Type ${typeDec.id} already declared in this scope`);
    }
    this.valueMap[typeDec.id] = typeDec.type;
  }

  // Returns the type entity bound to the given identifier, starting from this
  // context and searching "outward" through enclosing contexts if necessary.
  lookupType(id) {
    for (let context = this; context !== null; context = context.parent) {
      if (id in context.typeMap) {
        return context.typeMap[id];
      }
    }
    throw new Error(`Type ${id} has not been declared`);
  }

  // Returns the variable or function entity bound to the given identifier,
  // starting from this context and searching "outward" through enclosing
  // contexts if necessary.
  lookupValue(id) {
    for (let context = this; context !== null; context = context.parent) {
      if (id in context.valueMap) {
        return context.valueMap[id];
      }
    }
    throw new Error(`${id} has not been declared`);
  }
}

Context.INITIAL = new Context();
standardFunctions.forEach((f) => { Context.INITIAL.valueMap[f.id] = f; });
Context.INITIAL.typeMap.int = IntType;
Context.INITIAL.typeMap.string = StringType;
Context.INITIAL.typeMap.nil = NilType;

module.exports = Context;
