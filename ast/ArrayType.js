module.exports = class ArrayType {
  constructor(memberType) {
    Object.assign(this, { memberType });
  }
};
