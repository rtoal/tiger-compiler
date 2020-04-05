const util = require('util');

module.exports = root => {
  const entities = new Map();
  addReachableEntities(root, entities);
  return [...entities].map(([node, index]) => detailLine(node, index, entities)).join('\n');
};

function addReachableEntities(node, entities) {
  if (node === null || typeof node !== 'object' || entities.has(node)) {
    return;
  }
  entities.set(node, entities.size);
  Object.values(node).forEach(value => {
    if (Array.isArray(value)) {
      value.forEach(n => addReachableEntities(n, entities));
    } else {
      addReachableEntities(value, entities);
    }
  });
}

function ref(value, entities) {
  if (Array.isArray(value)) {
    return `[${value.map(v => ref(v, entities))}]`;
  } else if (typeof value === 'object' && value !== null) {
    return `#${entities.get(value)}`;
  } else if (typeof value !== 'function') {
    return util.inspect(value);
  }
}

function detailLine(node, index, entities) {
  let line = `${index} (${node.constructor.name})`;
  Object.keys(node).forEach(key => {
    const value = ref(node[key], entities);
    if (value !== undefined) {
      line += ` ${key}=${value}`;
    }
  });
  return line;
}
