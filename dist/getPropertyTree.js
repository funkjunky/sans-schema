const getPropertyTree = (obj, defaultValue, ...keys) => {
  if (!obj) return defaultValue;
  if (!keys.length) return obj;
  const [key, ...otherKeys] = keys;
  return getPropertyTree(obj[key], defaultValue, ...otherKeys);
};

export default getPropertyTree;