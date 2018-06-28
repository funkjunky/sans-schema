import pluralize from './pluralize';
import getPropertyTree from './getPropertyTree';
import expandable from './expandable';
import forEachM2mRelation from './forEachM2mRelation';

// Function that expands things based on keyToModel
// Deepness 1: { id: 1 } => { id: 1, name: 'thing', commit: { id: 2 } }
// Deepness 2: { id: 1 } => { id: 1, name: 'thing', commit: { id: 2, version: 2, message: 'hello' } }
export default (modelName, model, state, deepness=2, config={}) => {
    const { keyToModel={}, oneToOne={}, manyToMany={} } = config;

    //TODO: defining _expandModel function every call seems ineffecient
    const _expandModel = (modelName, model, deepness) => {
        // If we've expanded as deep as asked, then we're done! Return the model as-is
        if (deepness === 0) return model;

        // Grab the model from the store, if it doesn't exist, then return the model as-is
        const storeModel = state[modelName][model.id];
        if (!storeModel) return model;

        const newModel = Object.assign({}, storeModel);
        Object.keys(newModel).forEach(key => {
            if (!expandable(storeModel, key, modelName, oneToOne)) return;

            //get the model name for the key, for example work_commit => commits
            const modelKey = getPropertyTree(keyToModel, key, modelName, key);
            if (Array.isArray(newModel[key])) {
                //for each model in the array, expand it further
                newModel[key] = newModel[key].map(keyModel => {
                    return _expandModel(modelKey, keyModel, deepness - 1);
                });
            } else if (typeof newModel[key] === 'object') {
                newModel[key] = _expandModel(pluralize(modelKey), newModel[key], deepness - 1);
            }
        });

        // Check for many to many
        forEachM2mRelation(modelName, manyToMany, (m2mKey, key) => {
            const modelAliases = getPropertyTree(keyToModel, false, modelName);
            let modelKey = key;
            if (modelAliases) {
                const aliasKey = Object.entries(modelAliases).find(([alias, modelKey]) => modelKey === key);
                if (aliasKey) modelKey = aliasKey[0];
            }
            newModel[modelKey] = state[m2mKey][modelName][model.id][key].map(model => _expandModel(key, model, deepness - 1));
        });

        return newModel;
    };

    // Start the recursion... and return it when done.
    return _expandModel(modelName, model, deepness);
};
