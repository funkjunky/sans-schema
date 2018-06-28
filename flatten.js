import pluralize, { singulize } from './pluralize.js';
import getPropertyTree from './getPropertyTree.js';
import expandable from './expandable';
import forEachM2mRelation from './forEachM2mRelation';

// const flattenUsers = flatten('users')
// examples: yield put(mergeUsers(flattenUsers(unnormalizedUsers)))
// format:
//  {
//      assets: {
//          1: { id: 1, commits: [{ id: 7 }], ... },
//          2: { id: 2, ... },
//      },
//      commits: {
//          7: { id: 7, asset: { id: 1 } }
//      }
//  }
export default (modelName, config={}) => data => {
    const { models=[], oneToOne={}, keyToModel={}, manyToMany={} } = config;

    let result = {};

    const flattenModel = (modelName, model) => {
        if (models.length && !models.includes(modelName)) {
            console.warn('model name doesnt exist: ', modelName);
            return;
        }
        if (!model.id) return;

        // if first model of type modelName, then create the modelName hash
        if (!result[modelName])
            result[modelName] = {};

        // if it's the first model with this ide, then create the model object
        if (!result[modelName][model.id])
            result[modelName][model.id] = {};

        Object.keys(model).forEach((key) => {
            // if member is an object, then we need to extract it into our flattened data
            if (expandable(model, key, modelName, oneToOne)) {

                const mappedKey = getPropertyTree(keyToModel, key, modelName, key);
                // if member is an array, then extract all the models into flattened data
                if (Array.isArray(model[key])) {
                    // TODO: we should be able to assume a m2m relationship given an array of models, related to an array of models
                    // The challenge well be remembering this relationship. Because once it's in m2m, the models lose reference to the relationship.
                    const foundM2m = forEachM2mRelation(mappedKey, manyToMany, (m2mKey, relativeKey) => {
                        if (!result[m2mKey]) result[m2mKey] = {};
                        if (!result[m2mKey][mappedKey]) result[m2mKey][mappedKey] = {};
                        if (!result[m2mKey][relativeKey]) result[m2mKey][relativeKey] = {};
                        result[m2mKey][relativeKey][model.id] = {
                            id: model.id,
                            [mappedKey]: model[key].map(({ id }) => ({ id })),
                        };
                        model[key].forEach(({ id }) => {
                            // Only if we haven't added this models id to the m2m relationship...
                            if (!getPropertyTree(result[m2mKey][mappedKey], [], id, relativeKey).find(({ id }) => id === model.id)) {
                                // add this model to the m2m relationship.
                                result[m2mKey][mappedKey][id] = {
                                    id,
                                    [relativeKey]: [{ id: model.id }]
                                };
                            }
                        });
                    });

                    if (!foundM2m) {
                        result[modelName][model.id][key] = model[key].map(({ id }) => ({ id }));

                        let mappedModelKey = getMappedKey(keyToModel, mappedKey, singulize(modelName));
                        flattenArrayOfModels(mappedKey, model[key].map(m => {
                            if (!m[mappedModelKey] && !m[modelName]) {
                                return {
                                    [mappedModelKey]: { id: model.id },
                                    ...m   //The model takes precedence for data.
                                };
                            } else return m;
                        }));
                    // TODO: NOT DRY
                    } else {
                        let mappedModelKey = getMappedKey(keyToModel, mappedKey, singulize(modelName));
                        flattenArrayOfModels(mappedKey, model[key]);
                    }
                // Else it's a plain object, just recurse
                // Note: we only continue if we have data to add, otherwise we'd go infinite
                } else {
                    if (Object.keys(model) >= 1 || !result[pluralize(mappedKey)] || !result[pluralize(mappedKey)][model[key].id]) {
                        let mappedModelKey = getMappedKey(keyToModel, mappedKey, singulize(modelName));
                        if (!model[key][mappedModelKey] && !model[key][modelName]) {
                            flattenModel(pluralize(mappedKey), {
                                [mappedModelKey]: { id: model.id },
                                ...model[key],
                            });
                        } else {
                            flattenModel(pluralize(mappedKey), model[key]);
                        };
                    }
                    result[modelName][model.id][key] = { id: model[key].id };
                }
            } else {
                result[modelName][model.id][key] = model[key];
            }
        });
    };

    const flattenArrayOfModels = (modelName, models) => {
        models.forEach(model => {
            flattenModel(modelName, model);
        });
    };

    // This is where we start the flattening process.
    if (Array.isArray(data)) {
        flattenArrayOfModels(modelName, data);
    } else {
        flattenModel(modelName, data);
    }

    // We return the result of flattening, which is computer through recursion.
    return result;
};

// TODO: done quickly, prob not best solution.
const getMappedKey = (keyToModel, modelName, key) => {
    let mappedModelKey = key;
    const modelMappedKeys = keyToModel[modelName];
    if (modelMappedKeys) {
        Object.entries(modelMappedKeys).forEach(([mappedKey, original]) => {
            if (original === key) {
                mappedModelKey = mappedKey;
            }
        });
    }
    return mappedModelKey;
};
