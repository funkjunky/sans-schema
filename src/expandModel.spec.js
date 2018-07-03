import chai from 'chai';
import { modelName, personWithConfig, personNoConfig, flatPerson, person, config, stateNoConfig, stateWithConfig } from './sampleData';

import expandModel from './expandModel';

var assert = chai.assert;

describe('expandModel', () => {
    const personJustId = { id: person.id };

    describe('without config', () => {
        it('Should expand flattened data into a person (1 deep)', () => {
            const value = expandModel(modelName, personJustId, stateNoConfig, 1);
            assert.deepEqual(value, flatPerson);
        });

        it('Should expand flattened data into a person (2 deep)', () => {
            const value = expandModel(modelName, personJustId, stateNoConfig, 2);
            assert.deepEqual(value, personNoConfig);
        });
    });

    describe('with config', () => {
        it('Should expand flattened data into a person (1 deep)', () => {
            let flatPersonWithCompany = Object.assign({}, flatPerson);
            flatPersonWithCompany.company = Object.assign({} , person.company);
            const value = expandModel(modelName, personJustId, stateWithConfig, 1, config);
            assert.deepEqual(value, flatPersonWithCompany);
        });

        it('Should expand flattened data into a person (2 deep)', () => {
            const value = expandModel(modelName, personJustId, stateWithConfig, 2, config);
            assert.deepEqual(value, personWithConfig);
        });
    });
});
