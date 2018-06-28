import getPropertyTree from './getPropertyTree';
import expandable from './expandable';
import getM2mRelation from './getM2mRelation';
import forEachM2mRelation from './forEachM2mRelation';
import pluralize, { singulize } from './pluralize';

// Used to remove / nullify related members
// ie. removeModel dependency, removing from asset.dependencies, etc.
export default (modelName, model, state, config={}) => {
    const { keyToModel={}, oneToOne={}, manyToMany={} } = config;
    let result = {};

    // manyToMany (m2m may not and often isn't in the object itsself, unless expanded)
    forEachM2mRelation(modelName, manyToMany, (m2mModelKey, otherKey) => {
        //TODO: replace m2mModelKet with otherkey
        result[m2mModelKey] = {
            [otherKey]: {},
        };

        Object.values(state[m2mModelKey][otherKey])
            .forEach(m => {
                let keyModel = result[m2mModelKey][otherKey];
                keyModel[m.id] = {
                    id: m.id,
                    [modelName]: state[m2mModelKey][otherKey][m.id][modelName].filter(({ id }) => id !== model.id),
                };
            });
    });

    Object.keys(model).forEach(key => {
        let mappedKey = getPropertyTree(keyToModel, key, modelName, key);

        // if somehow a m2m key got into the object, then ignore it. We handle m2m automatically above.
        if(getM2mRelation(modelName, mappedKey, manyToMany)) {
            return;
        }

        // manyToOne
        if (Array.isArray(model[key])) {
            if (!result[mappedKey]) result[mappedKey] = {};

            // nullify the referenced model
            model[key].forEach(({ id }) => {
                // modelName = 'companies' => 'company' (person['company'] = null)
                result[mappedKey][id] = { id, [singulize(modelName)]: null };
            });

        // oneToMany
        } else if (typeof model[key] === 'object') {
            const pluralizedMappedKey = pluralize(mappedKey);
            if (!result[pluralizedMappedKey]) result[pluralizedMappedKey] = {};

            const stateEntity = state[pluralizedMappedKey][model[key].id];

            // filter out the referenced model
            result[pluralizedMappedKey][model[key].id] = {
                id: model[key].id,
                [modelName]: stateEntity[modelName].filter(v => v.id !== model.id),
            };
        }
    });

    return result;
};
