module.exports = class FunDec {
  constructor(id, params, returnType, body) {
    Object.assign(this, { id, params, returnType, body });
  }
};
