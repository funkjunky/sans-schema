import chai from 'chai';

import pluralize from './pluralize.js';

var assert = chai.assert;

describe('pluralize', () => {
    it('should replace the y with ies', () => {
        const value = pluralize('company');
        assert.strictEqual(value, 'companies');
    });

    it('should add an s, if the last letter isn\'t a y', () => {
        const value = pluralize('mango');
        assert.strictEqual(value, 'mangos');
    });
});
