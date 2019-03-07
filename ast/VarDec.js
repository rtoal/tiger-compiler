module.exports = class VarDec {
  constructor(id, type, init) {
    Object.assign(this, { id, type, init });
  }
};
