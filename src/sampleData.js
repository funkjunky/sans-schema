export const modelName = 'persons';

export const m2mModelsModel = 'personsXhockeyTeams';
export const m2mModelsKey1 = 'persons';
export const m2mModelsKey2 = 'hockeyTeams';

export const manyToMany = {
    personsXhockeyTeams: ['persons', 'hockeyTeams'],
};

export const oneToOne = {
    persons: ['company'],
};

export const keyToModel = {
    persons: { favourites: 'hockeyTeams' },
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
        persons: [
            { id: 1 },
        ],
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
    hats: [
        {
            id: 1,
            style: 'snapback',
            person: { id: 1 },
        },
        {
            id: 2,
            style: 'fullbrim',
            person: { id: 1 },
        },
    ],
};

export const personWithConfig = {
    ...person,
    favourites: person.favourites.map(f => ({
        ...f,
        persons: [{ id: person.id }]
    })),
};

export const personNoConfig = {
    ...person,
    favourites: person.favourites.map(f => ({
        ...f,
        person: { id: person.id },
    })),
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
    hats: [
        {
            id: 1,
        },
        {
            id: 2,
        },
    ],
};

export const stateWithConfig = {
    persons: {
        1: {
            id: 1,
            firstName: 'Jason',
            hats: [{ id: 1 }, { id: 2 }],
            company: {
                id: 1,
                name: 'Quaker Oats',
                persons: [
                    { id: 1 },
                ],
            },
        },
    },
    personsXhockeyTeams: {
        persons: {
            1: {
                id: 1,
                hockeyTeams: [
                    { id: 2 },
                    { id: 3 },
                ],
            },
        },
        hockeyTeams: {
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
