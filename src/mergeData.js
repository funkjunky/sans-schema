import produce from 'immer';

const mergeMutable = (oldObj, newObj, key) => {
  if (typeof newObj[key] !== 'object' || typeof oldObj[key] === 'undefined') {
    oldObj[key] = newObj[key];
  } else {
    Object.keys(newObj[key]).forEach(k => mergeMutable(oldObj[key], newObj[key], k))
  }
}

export const mergeData = (oldObj, newObj) => produce(oldObj, draftObj =>
  Object.keys(newObj).forEach(key => mergeMutable(draftObj, newObj, key))
);
