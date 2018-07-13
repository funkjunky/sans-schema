import chai from 'chai';
import { modelName, person, personWithConfig, personNoConfig, config, stateNoConfig, stateWithConfig } from './sampleData';

import flatten from './flatten.js';

var assert = chai.assert;

describe('flatten', () => {
    it('Should return an empty object if given an empty array', () => {
        const value = flatten(modelName)([]);
        assert.deepEqual(value, {});
    });

    it('Should return an empty object if given an empty object', () => {
        const value = flatten(modelName)({});
        assert.deepEqual(value, {});
    });

    it('Should flatten person correctly, without config needed.', () => {
        const value = flatten(modelName)(person);
        assert.deepEqual(value, stateNoConfig);
    });

    it('Should flatten person correctly while using config.', () => {
        const value = flatten(modelName, config)(person);
        assert.deepEqual(value, stateWithConfig);
    });
});
