import chai from 'chai';
import { modelName, person, config, stateWithConfig, stateNoConfig } from './sampleData';

import removeModel from './removeModel';

var assert = chai.assert;

describe('removeModel', () => {
    it('(1:1) should nullify company from person with no config', () => {
        const noConfigNoCompany = {
            persons: {
                1: {
                    id: 1,
                    company: null
                },
            },
        };
        const value = removeModel('companies', person.company, stateNoConfig);
        assert.deepEqual(value, noConfigNoCompany);
    });

    it('(1:*) should remove hat from person with no config', () => {
        const noConfigLessHat = {
            persons: {
                1: {
                    id: 1,
                    hats: [{ id: person.hats[1].id }],
                },
            },
        };
        const value = removeModel('hats', person.hats[0], stateNoConfig);
        assert.deepEqual(value, noConfigLessHat);
    });

    it('(*:*) should remove team Leafs from person with config', () => {
        //TODO: the data in this is a mess... I need to re-use the same sample data for teams in a correct way
        // ie. have a list of teams, remove one, and use the other everywhere else.
        const team = stateWithConfig.hockeyTeams[2];
        const withConfigLessTeam = {
            personsXhockeyTeams: {
                persons: {
                    [person.id]: {
                        id: person.id,
                        favourites: [{ id: person.favourites[1].id }],
                    },
                },
            }
        };
        const value = removeModel('hockeyTeams', stateWithConfig.hockeyTeams[2], stateWithConfig, config);
        assert.deepEqual(value, withConfigLessTeam);
    });
});
