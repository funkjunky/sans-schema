export default (modelName, m2mModels, cb) => {
    const m2mRelationships = Object.entries(m2mModels)
        .filter(([m2mKey, relationships]) => Object.keys(relationships).includes(modelName));
    m2mRelationships.forEach(
        ([m2mKey, relationships]) => {
            const otherModelName = Object.keys(relationships).find(k => k !== modelName);
            cb(m2mKey, relationships[modelName], otherModelName);
        }
    );

    return m2mRelationships.length > 0;
};
