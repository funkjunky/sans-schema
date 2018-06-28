import * as normalizer from 'schemaless-normalizer';

import * as config from './config';

export const removeModel = (...args) => normalizer.removeModel(...args, config);

export const expandModel = (modelName, model, state, deepness=2) =>
    normalizer.expandModel(modelName, model, state, deepness, config);

export const flatten = (...args) => normalizer.flatten(...args, config);

/****
 * This kind of index file, allows you to remove an argument from each function.
 * This reduces boilerplate. You can also remove the normalizer namespace this way.
 * ***/
