import chai from 'chai';

import expandable from './expandable.js';
import { person, oneToOne } from './sampleData';

var assert = chai.assert;

describe('expandable', () => {
    const keyToObject = 'company';
    const keyToScalar = 'firstName';
    const keyNotExist = 'flavour';

    describe('with oneToOne not set', () => {
        it('should return true with a model key pointing to an object', () => {
            assert.isTrue(expandable(person, keyToObject))
        });

        it('should return false with a key pointing to a scalar', () => {
            assert.isNotTrue(expandable(person, keyToScalar))
        });

        it('should return false with a key not found in the model', () => {
            assert.isNotTrue(expandable(person, keyNotExist))
        });
    });

    describe('with oneToOne set', () => {
        it('should return true with key found in the model, but without the modelName or key found in the oneToOne arg', () => {
            assert.isTrue(expandable(person, keyToObject))
        });

        it('should return false with key found in the model and modelName and key found in the oneToOne arg', () => {
            assert.isNotTrue(expandable(person, keyToObject, 'persons', oneToOne))
        });
    });
});
