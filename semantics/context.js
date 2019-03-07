/*
 * Semantic Analysis Context
 *
 * A context object holds state for the semantic analysis phase.
 *
 *   const Context = require('./semantics/context');
 */

const { standardFunctions } = require('./builtins');

require('./analyzer');

// A context object holds:
//
//   A reference to the parent context (or null if this is the root context)
//   A reference to the current function we are analyzing, if any
//   Whether we are in a loop
//   A map for looking up types immediately declared in this context
//   A map for looking up vars and functions immediately declared in this context
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
    // For a simple block (i.e., in an if-statement), we have to retain both
    // the function and loop settings.
    return new Context({
      parent: this,
      currentFunction: this.currentFunction,
      inLoop: this.inLoop,
    });
  }

  // Call this to add a new entity (which could be a variable, a function,
  // or a parameter) to this context. It will check to see if the entity's
  // identifier has already been declared in this context. It does not need
  // to check enclosing contexts because in this language, shadowing is always
  // allowed. Note that if we allowed overloading, this method would have to
  // be a bit more sophisticated.
  add(entity) {
    if (entity.id in this.valueMap) {
      throw new Error(`Identifier ${entity.id} already declared in this scope`);
    }
    this.valueMap[entity.id] = entity;
  }

  // Returns the type entity bound to the given identifier, starting from this
  // context and searching "outward" through enclosing contexts if necessary.
  lookupType(id) {
    if (id in this.typeMap) {
      return this.typeMap[id];
    }
    if (this.parent === null) {
      throw new Error(`Type ${id} has not been declared`);
    }
    return this.parent.lookup(id);
  }

  // Returns the variable or function entity bound to the given identifier,
  // starting from this context and searching "outward" through enclosing
  // contexts if necessary.
  lookupValue(id) {
    if (id in this.valueMap) {
      return this.valueMap[id];
    }
    if (this.parent === null) {
      throw new Error(`Type ${id} has not been declared`);
    }
    return this.parent.lookup(id);
  }

  assertInFunction(message) {
    if (!this.currentFunction) {
      throw new Error(message);
    }
  }
}

Context.INITIAL = new Context();
standardFunctions.forEach(f => f.analyze(Context.INITIAL));

module.exports = Context;
