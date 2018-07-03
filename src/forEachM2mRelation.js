export default (modelName, m2mModels, cb) => {
    const m2mCount = Object.entries(m2mModels)
        .filter(([m2mKey, modelKeys]) => modelKeys.includes(modelName));
    m2mCount.forEach(([m2mKey, [key1, key2]]) => cb(m2mKey, key1 === modelName ? key2 : key1));

    return m2mCount.length > 0;
};
