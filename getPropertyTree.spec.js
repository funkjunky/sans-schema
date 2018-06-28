import chai from 'chai';

import getPropertyTree from './getPropertyTree.js';

var assert = chai.assert;

describe('getPropertyTree', () => {
    const defaultValue = '~defaultValue~';
    const key = '~key\'s value~';
    const objWithKeys = { key };

    it('Should return default value, if object doesnt exist', () => {
        const objWithoutKey = {};
        const value = getPropertyTree(objWithoutKey[key], defaultValue, 'nonExistentKey');
        assert.strictEqual(value, defaultValue);
    });

    it('Should return defaultValue, if second key doesnt exist', () => {
        const value = getPropertyTree(objWithKeys, defaultValue, key, 'nonExistentKey');
        assert.strictEqual(value, defaultValue);
    });

    it('Should return key\'s value when key does exist', () => {
        const value = getPropertyTree(objWithKeys, defaultValue, 'key');
        assert.strictEqual(value, key);
    });
});
