import chai from 'chai';
import { m2mModelsModel, m2mModelsKey1, m2mModelsKey2, manyToMany, person } from './sampleData';

import forEachM2mRelation from './forEachM2mRelation';

var assert = chai.assert;

describe('forEachM2mRelation', () => {
    describe('Calling with reasonable m2mModels data', () => {
        describe('with a modelName in m2mModels', () => {
            it('Should call the callback with the correct keys', () => {
                forEachM2mRelation(m2mModelsKey1, manyToMany, (m2mKey, otherKey) => {
                    assert.strictEqual(m2mKey, m2mModelsModel);
                    assert.strictEqual(otherKey, manyToMany.personsXhockeyTeams.persons);
                });
            });
        });
        describe('with a modelName not within m2mModels', () => {
            const keyNotInM2mModels = 'Daves_not_here_man';
            it('Should NOT call the callback', () => {
                forEachM2mRelation(keyNotInM2mModels, manyToMany, () => {
                    assert.fail(
                        'Got arguments: ' + arguments,
                        'Not to be called',
                        'forEach cb called when it should NOT have been called'
                    );
                });
            });
        });
    });
});
