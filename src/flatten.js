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

                    const m2mRelation = Object.entries(manyToMany).find(([m2mKey, relations]) => Object.values(relations).includes(key));
                    if (m2mRelation) {
                        const m2mKey = m2mRelation[0];
                        // Note: this is a bit of a mind fuck... we want the key for the value that is NOT the key we provided. Because m2m key points to the referenced key alias.
                        // persons: favourites
                        // hockeyTeams: fans
                        // We have "favourites", we need hockeyTeams, which is what favourites represents and we need fans, which is the alias for persons.
                        const [m2mRelatedModelName, m2mModelAlias] = Object.entries(m2mRelation[1]).find(([k, v]) => v !== key);
                        if (!result[m2mKey]) result[m2mKey] = {};
                        if (!result[m2mKey][key]) result[m2mKey][key] = {};
                        if (!result[m2mKey][m2mModelAlias]) result[m2mKey][m2mModelAlias] = {};
                        result[m2mKey][m2mModelAlias][model.id] = {
                            id: model.id,
                            [key]: model[key].map(({ id }) => ({ id })),
                        };
                        model[key].forEach(({ id }) => {
                            // Only if we haven't added this models id to the m2m relationship...
                            if (!getPropertyTree(result[m2mKey][key], [], id, m2mModelAlias).find(({ id }) => id === model.id)) {
                                // add this model to the m2m relationship.
                                result[m2mKey][key][id] = {
                                    id,
                                    [m2mModelAlias]: [{ id: model.id }]
                                };
                            }
                        });
                        flattenArrayOfModels(m2mRelatedModelName, model[key]);
                    } else {
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
                    }
                // Else it's a plain object, just recurse
                // Note: we only continue if we have data to add, otherwise we'd go infinite
                } else {
                    if (Object.keys(model) >= 1 || !result[pluralize(mappedKey)] || !result[pluralize(mappedKey)][model[key].id]) {
                        //we have modelName, key (key could be alias), we need realKey, we need modelName's alias under realKey
                        const realKey = pluralize(getPropertyTree(keyToModel, key, modelName, key));
                        const modelNameAlias = (Object.entries(keyToModel[realKey] || []).find(([k, v]) => v === modelName) || [modelName])[0];
                        flattenModel(realKey, {
                            [modelNameAlias]: [{ id: model.id }],
                            ...model[key],
                        });
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
