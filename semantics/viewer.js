module.exports = root => {
  const dataset = { entities: [], edges: [] };
  addReachableEntities(root, dataset, -1);
  dataset.entities = dataset.entities.map(e => nodeText(e));
  return dataset;
};

function nodeText(node) {
  let text = node.constructor.name;
  Object.entries(node).forEach(([prop, value]) => {
    if (['boolean', 'number', 'string'].includes(typeof value)) {
      text += ` ${prop}=${value}`;
    }
  });
  return text;
}

function addReachableEntities(node, dataset, parentIndex, label) {
  if (dataset.entities.includes(node)) {
    dataset.edges.push({ source: parentIndex, target: dataset.entities.indexOf(node), label });
    return;
  }

  dataset.entities.push(node);
  const nodeIndex = dataset.entities.length - 1;
  if (parentIndex >= 0) {
    dataset.edges.push({ source: parentIndex, target: nodeIndex, label });
  }

  Object.entries(node).forEach(([prop, value]) => {
    if (Array.isArray(value)) {
      value.forEach((n, i) => addReachableEntities(n, dataset, nodeIndex, `${prop}[${i}]`));
    } else if (typeof value === 'object' && value !== null) {
      addReachableEntities(value, dataset, nodeIndex, prop);
    }
  });
}

// module.exports = root => {
//   const entities = new Map();
//   addReachableEntities(root, entities);
//   return [...entities].map(([node, index]) => detailLine(node, index, entities)).join('\n');
// };

// function addReachableEntities(node, entities) {
//   if (node === null || typeof node !== 'object' || entities.has(node)) {
//     return;
//   }
//   entities.set(node, entities.size);
//   Object.values(node).forEach(value => {
//     if (Array.isArray(value)) {
//       value.forEach(n => addReachableEntities(n, entities));
//     } else {
//       addReachableEntities(value, entities);
//     }
//   });
// }

// function ref(value, entities) {
//   if (value === undefined || typeof value === 'function') {
//     return undefined;
//   } else if (Array.isArray(value)) {
//     return `[${value.map(v => ref(v, entities))}]`;
//   } else if (typeof value === 'object' && value !== null) {
//     return `#${entities.get(value)}`;
//   }
//   return util.inspect(value);
// }

// function detailLine(node, index, entities) {
//   let line = `${index} (${node.constructor.name})`;
//   Object.keys(node).forEach(key => {
//     const value = ref(node[key], entities);
//     line += value === undefined ? '' : ` ${key}=${value}`;
//   });
//   return line;
// }
