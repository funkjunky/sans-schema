![From pixabay](https://cdn.pixabay.com/photo/2016/08/05/09/31/banner-1571861_1280.jpg "taken from another place. open source this time!")

# Sans Schema

[![Build Status](https://travis-ci.org/funkjunky/schemaless-normalizer.svg?branch=master)](https://travis-ci.org/funkjunky/schemaless-normalizer) [![codecov](https://codecov.io/gh/funkjunky/schemaless-normalizer/branch/master/graph/badge.svg)](https://codecov.io/gh/funkjunky/schemaless-normalizer) [![dependencies](https://david-dm.org/funkjunky/schemaless-normalizer.svg)](https://david-dm.org/funkjunky/schemaless-normalizer) [![dependencies](https://david-dm.org/funkjunky/schemaless-normalizer/dev-status.svg)](https://david-dm.org/funkjunky/schemaless-normalizer?type=dev) [![Maintainability](https://api.codeclimate.com/v1/badges/c890f2aadbb342cf08df/maintainability)](https://codeclimate.com/github/funkjunky/schemaless-normalizer/maintainability) [![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/funkjunky/sans-schema/pulls)

## [Why](#Why)- [Getting Started](#Getting-Started) - [Simplest Use Case](#Simplest-Use-Case) - [Format](#Format-of-flattened-data) - [Docs](#Function-definitions)
### [Contributing](#Contributing) - [Versioning](#Versioning) - [Authors](#Authors)

Why?
====

I wanted a single source of truth, and I wanted it without having to create schemas. You don't need to define every square inch of your data in a library domain specific way (ie. Typescript), instead just flatten and expand your data, nothing more.
If you have many to many relationships, this is impossible to do without some configuration, so you will have to define which models are many-to-many relationships. There are many other configurations like aliases, but nothing is required. It's zero-config by nature. 

Getting Started
===============

```bash
yarn add sans-schema
```

```javascript
import { flatten, expandModel, removeModel } from 'sans-schema';
```

Disclaimer
==========

This library has been used in production, but error handling is dealt with outside the library. If you don't provide the required parameters in the correct format, the code well crash (fail fast).

If you have mission critical code, feel free to wrap this code in exceptional handling. The code doesn't throw any exceptions currently. If anyone wants to contribute and add the throws, please feel free in a PR :)

simplest use-case
=================

```javascript
import { configureStore } from 'redux-toolkit';
import { mergeModelReducer, flatten, expandModel, removeModel, mergeNormalizedModels } from 'sans-schema';

const store = configureStore({
    companies: mergeModelReducer('companies'),
    users: mergeModelReducer('users'),
});

const data = { id: 1, name: 'Jason', company: { id: 1, city: 'Montreal' } };

const flatData = flatten('users')(data);
const expandedFlatData = expandModel('users', { id: 1 }, flatData);
const flatDataSansCompanyWithId1 = removeModel('companies', data.company, flatData);

// Using the data with Redux
store.dispatch(mergeNormalizeModels(flatData));
const expandedUser = expandModel('users', { id: 1 }, store.getState());

// removing a model reference from all other models. ie. user: { id: 123, company: { id: 1 } } becomes { id: 123, company: null }, and the same for all other models referencing company = { id: 1 }
store.dispatch(mergeNormalizedModels(flatDataSansCompanyWithId1));
// ...then your action to remove the model from it's slice
store.disaptch(RemoveCompany({ id: 1 }));
```

What's the deal with loadNormalizedData action...
=================================================

flatten and removeModel return flattened data that should be merged in your reducers.
By using a single action for all data changes you end up with a single render.

Format of flattened data:
=========================
This is an example result from ```flatten(modelName, config)(modelInstance);```
Also see [```sampleData.js``` for examples](https://github.com/funkjunky/sans-schema/blob/master/src/sampleData.js)

```javascript
{
    modelNames: {   // model names must always be plural
        1: {
            // note: id is the only required data for EVERY model
            id: 1,  //the key is the id
            name: 'hello',  //arbitrary primitives
            secondModelNames: {
                id: 3,  //Only the id well be here. expandModel well expand this.
            },
        }
    },
    secondModelNames: { ... },
    thirdModelNames: { ... },
    // Note: modelNames doesn't reference thirdModelNames, yet it's related through this m2m object
    modelNamesXthirdModelNames: {   // This key can be anything you want.
        modelNames: {
            1: {
                id: 1,  //Every model always has an id, even in m2m
                thirdModelNames: [  //m2m only includes reference instances with ids only
                    { id: 2 },
                    { id: 3 },
                    ...
                ],
            }
            ...
        },
        thirdModelNames: {
            2: {
                id: 2,
                modelNames: [
                    { id: 3 },
                    ...
                ],
            },
            ...
        },
    },
    ...
}
```

Full example with React and Redux
=================================

[Sans Schema demo](https://github.com/funkjunky/complete-sans-schema-demo) [OUTDATED, the library is easier to use now]

... Note: I well eventually make another demo with commit by commit tutorial on using Sans Schema...

Function definitions
====================

#### `flatten(modelName, config?)(data) : function`
Flattens hierarchical data to be placed in a data store representing a single source of truth.
- `modelName : string (plural form)` - `required` - Specifies which model the object, or array of objects represents.
- `config : `[`Config Object`](#config) - `optional` - Passed to every function, that defines custom relationships between models.
- `data : object` - `required` - Hierarchical data to be flattened
**returns** `object` - flat single-source data.

#### `expandModel(modelName, model, state, deepness?, config?) : function`
Flattens hierarchical data to be placed in a data store representing a single source of truth.
- `modelName : string (plural form)` - `required` - Specifies which model the object, or array of objects represents.
- `model : object` - `required` - The model to be expanded
- `state : object` - `required` - Single source flattened data (ie. store.getState())
- `deepness : integer` - `optional` - The depth the model is expanded
- `config : `[`Config Object`](#config) - `optional` - Passed to every function, that defines custom relationships between models.
**returns** `object` - Hierarchical data

#### `removeModel(modelName, model, state, config?) : function`
Searches the state for references of model and nullifies them. This returns the flattened data representing the updated state of models that were changed, to be merged with the original state.
- `modelName : string (plural form)` - `required` - Specifies which model the object, or array of objects represents.
- `model : object` - `required` - The model to be expanded
- `state : object` - `required` - Single source flattened data (ie. store.getState())
- `config : `[`Config Object`](#config) - `optional` - Passed to every function, that defines custom relationships between models.
**returns** `object` - flat single-source data

Also, for Redux `mergeModelReducer(modelName)`, `mergeNormalizedModels(Action<{ models }>)`

Also, `mergeData(oldObj, newObj)`, which is a generic merging function that uses immer. It probably exists somewhere, and if it doesn't... someone should publish it =P

Config
======
*All keys in the config object are optional*
```javascript
{
    models: [pluralModelName:string],
    oneToOne: {
        subjectModel: [referenceModel:string],
    }
    keyToModel: {
        subjectModel: {
            referenceKey: referenceModelName:string
        }
    },
    manyToMany: {
        m2mModelName: [
            {
                modelName:string: secondModelNameAlias:string
                secondModelName:string: modelNameAlias:string
            }
        ]
    },
};
```
Note: You can name your manyToMany relationship whatever you want. In our examples and the tests we combine the names of the two models and put a capital X inbetween them.

Contributing
============

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on helping the project. Basically, make sure the tests pass and try to write nice code. If you're not sure whether you should submit a pull request, just do it, why not? ;)

Versioning
==========

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/funkjunky/sans-schema/tags). 

Authors
=======

* **Jason McCarrell** - *consultant* - [github](https://github.com/funkjunky)
* *Your name here*
