import getPropertyTree from './getPropertyTree';

export const modelName = 'persons';

export const m2mModelsModel = 'personsXhockeyTeams';
//TODO: are the below vars used?
export const m2mModelsKey1 = 'persons';
export const m2mModelsKey2 = 'hockeyTeams';

export const manyToMany = {
    personsXhockeyTeams: {
        persons: 'favourites',
        hockeyTeams: 'persons',
    },
};

export const oneToOne = {
    persons: ['company'],
};

export const keyToModel = {
    persons: { mostHated: 'hockeyTeam' },
    hockeyTeams: { dislikedBy: 'persons' },
};

export const config = {
    models: ['persons', 'hockeyTeams', 'hats',],
    oneToOne,
    keyToModel,
    manyToMany,
};

export const person = {
    id: 1,
    firstName: 'Jason',
    company: {
        id: 1,
        name: 'Quaker Oats',
    },
    favourites: [
        {
            id: 2,
            name: 'Leafs',
        },
        {
            id: 3,
            name: 'Senators',
        },
    ],
    mostHated: {
        id: 4,
        name: 'Red Wings',
    },
    hats: [
        {
            id: 1,
            style: 'snapback',
        },
        {
            id: 2,
            style: 'fullbrim',
        },
    ],
};

export const stateWithConfig = {
    persons: {
        1: {
            id: 1,
            firstName: 'Jason',
            hats: [{ id: 1 }, { id: 2 }],
            mostHated: { id: 4 },
            company: {
                id: 1,
                name: 'Quaker Oats',
            },
        },
    },
    personsXhockeyTeams: {
        persons: {
            1: {
                id: 1,
                favourites: [
                    { id: 2 },
                    { id: 3 },
                ],
            },
        },
        favourites: {
            2: {
                id: 2,
                persons: [{ id: 1 }],
            },
            3: {
                id: 3,
                persons: [{ id: 1 }],
            },
        },
    },
    hats: {
        1: {
            id: 1,
            style: 'snapback',
            person: { id: 1 },
        },
        2: {
            id: 2,
            style: 'fullbrim',
            person: { id: 1 },
        },
    },
    hockeyTeams: {
        2: {
            id: 2,
            name: 'Leafs',
        },
        3: {
            id: 3,
            name: 'Senators',
        },
        4: {
            id: 4,
            name: 'Red Wings',
            dislikedBy: [{ id: 1 }],
        }
    },
};

export const stateNoConfig = {
    persons: {
        1: {
            id: 1,
            firstName: 'Jason',
            company: {
                id: 1,
            },
            hats: [{ id: 1 }, { id: 2 }],
            mostHated: { id: 4 },
            favourites: [
                { id: 2 },
                { id: 3 },
            ],
        },
    },
    hats: {
        1: {
            id: 1,
            style: 'snapback',
            person: { id: 1 },
        },
        2: {
            id: 2,
            style: 'fullbrim',
            person: { id: 1 },
        },
    },
    companies: {
        1: {
            id: 1,
            name: 'Quaker Oats',
            persons: [{ id: 1 }],
        },
    },
    mostHateds: {
        4: {
            id: 4,
            persons: [{ id: 1 }],
            name: 'Red Wings',
        },
    },
    favourites: {
        2: {
            id: 2,
            name: 'Leafs',
            person: { id: 1 },
        },
        3: {
            id: 3,
            name: 'Senators',
            person: { id: 1 },
        },
    },
};

// manually expanding from state for example data.
export const personWithConfig = {
    ...person,
    hats: person.hats.map(h => stateWithConfig.hats[h.id]),
    favourites: person.favourites.map(f => ({
        ...stateWithConfig.hockeyTeams[f.id],
        persons: stateWithConfig.personsXhockeyTeams.favourites[f.id].persons,
    })),
    mostHated: {
        ...stateWithConfig.hockeyTeams[person.mostHated.id],
        persons: getPropertyTree(stateWithConfig.personsXhockeyTeams.favourites, [], person.mostHated.id, 'persons'),
    },
};

export const personNoConfig = {
    ...person,
    company: stateNoConfig.companies[person.company.id],
    hats: person.hats.map(h => stateNoConfig.hats[h.id]),
    favourites: person.favourites.map(f => stateNoConfig.favourites[f.id]),
    mostHated: stateNoConfig.mostHateds[person.mostHated.id],
};

export const flatPerson = {
    id: 1,
    firstName: 'Jason',
    company: {
        id: 1,
    },
    favourites: [
        {
            id: 2,
        },
        {
            id: 3,
        },
    ],
    mostHated: {
        id: 4,
    },
    hats: [
        {
            id: 1,
        },
        {
            id: 2,
        },
    ],
};

