module.exports = class RecordExp {
  constructor(type, fieldBindings) {
    Object.assign(this, { type, fieldBindings });
  }
};
