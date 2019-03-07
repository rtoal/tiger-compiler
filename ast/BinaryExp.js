module.exports = class BinaryExp {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right });
  }
};
