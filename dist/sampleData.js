'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var modelName = exports.modelName = 'persons';

var m2mModelsModel = exports.m2mModelsModel = 'personsXhockeyTeams';
var m2mModelsKey1 = exports.m2mModelsKey1 = 'persons';
var m2mModelsKey2 = exports.m2mModelsKey2 = 'hockeyTeams';

var manyToMany = exports.manyToMany = {
    personsXhockeyTeams: ['persons', 'hockeyTeams']
};

var oneToOne = exports.oneToOne = {
    persons: ['company']
};

var keyToModel = exports.keyToModel = {
    persons: { favourites: 'hockeyTeams' }
};

var config = exports.config = {
    models: ['persons', 'hockeyTeams', 'hats'],
    oneToOne: oneToOne,
    keyToModel: keyToModel,
    manyToMany: manyToMany
};

var person = exports.person = {
    id: 1,
    firstName: 'Jason',
    company: {
        id: 1,
        name: 'Quaker Oats',
        persons: [{ id: 1 }]
    },
    favourites: [{
        id: 2,
        name: 'Leafs'
    }, {
        id: 3,
        name: 'Senators'
    }],
    hats: [{
        id: 1,
        style: 'snapback',
        person: { id: 1 }
    }, {
        id: 2,
        style: 'fullbrim',
        person: { id: 1 }
    }]
};

var personWithConfig = exports.personWithConfig = _extends({}, person, {
    favourites: person.favourites.map(function (f) {
        return _extends({}, f, {
            persons: [{ id: person.id }]
        });
    })
});

var personNoConfig = exports.personNoConfig = _extends({}, person, {
    favourites: person.favourites.map(function (f) {
        return _extends({}, f, {
            person: { id: person.id }
        });
    })
});

var flatPerson = exports.flatPerson = {
    id: 1,
    firstName: 'Jason',
    company: {
        id: 1
    },
    favourites: [{
        id: 2
    }, {
        id: 3
    }],
    hats: [{
        id: 1
    }, {
        id: 2
    }]
};

var stateWithConfig = exports.stateWithConfig = {
    persons: {
        1: {
            id: 1,
            firstName: 'Jason',
            hats: [{ id: 1 }, { id: 2 }],
            company: {
                id: 1,
                name: 'Quaker Oats',
                persons: [{ id: 1 }]
            }
        }
    },
    personsXhockeyTeams: {
        persons: {
            1: {
                id: 1,
                hockeyTeams: [{ id: 2 }, { id: 3 }]
            }
        },
        hockeyTeams: {
            2: {
                id: 2,
                persons: [{ id: 1 }]
            },
            3: {
                id: 3,
                persons: [{ id: 1 }]
            }
        }
    },
    hats: {
        1: {
            id: 1,
            style: 'snapback',
            person: { id: 1 }
        },
        2: {
            id: 2,
            style: 'fullbrim',
            person: { id: 1 }
        }
    },
    hockeyTeams: {
        2: {
            id: 2,
            name: 'Leafs'
        },
        3: {
            id: 3,
            name: 'Senators'
        }
    }
};

var stateNoConfig = exports.stateNoConfig = {
    persons: {
        1: {
            id: 1,
            firstName: 'Jason',
            company: {
                id: 1
            },
            hats: [{ id: 1 }, { id: 2 }],
            favourites: [{ id: 2 }, { id: 3 }]
        }
    },
    hats: {
        1: {
            id: 1,
            style: 'snapback',
            person: { id: 1 }
        },
        2: {
            id: 2,
            style: 'fullbrim',
            person: { id: 1 }
        }
    },
    companies: {
        1: {
            id: 1,
            name: 'Quaker Oats',
            persons: [{ id: 1 }]
        }
    },
    favourites: {
        2: {
            id: 2,
            name: 'Leafs',
            person: { id: 1 }
        },
        3: {
            id: 3,
            name: 'Senators',
            person: { id: 1 }
        }
    }
};