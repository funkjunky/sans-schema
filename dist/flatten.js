'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _pluralize = require('./pluralize.js');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _getPropertyTree = require('./getPropertyTree.js');

var _getPropertyTree2 = _interopRequireDefault(_getPropertyTree);

var _expandable = require('./expandable');

var _expandable2 = _interopRequireDefault(_expandable);

var _forEachM2mRelation = require('./forEachM2mRelation');

var _forEachM2mRelation2 = _interopRequireDefault(_forEachM2mRelation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// const flattenUsers = flatten('users')
// examples: yield put(mergeUsers(flattenUsers(unnormalizedUsers)))
// format:
//  {
//      assets: {
//          1: { id: 1, commits: [{ id: 7 }], ... },
//          2: { id: 2, ... },
//      },
//      commits: {
//          7: { id: 7, asset: { id: 1 } }
//      }
//  }
exports.default = function (modelName) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return function (data) {
        var _config$models = config.models,
            models = _config$models === undefined ? [] : _config$models,
            _config$oneToOne = config.oneToOne,
            oneToOne = _config$oneToOne === undefined ? {} : _config$oneToOne,
            _config$keyToModel = config.keyToModel,
            keyToModel = _config$keyToModel === undefined ? {} : _config$keyToModel,
            _config$manyToMany = config.manyToMany,
            manyToMany = _config$manyToMany === undefined ? {} : _config$manyToMany;


        var result = {};

        var flattenModel = function flattenModel(modelName, model) {
            if (models.length && !models.includes(modelName)) {
                console.warn('model name doesnt exist: ', modelName);
                return;
            }
            if (!model.id) return;

            // if first model of type modelName, then create the modelName hash
            if (!result[modelName]) result[modelName] = {};

            // if it's the first model with this ide, then create the model object
            if (!result[modelName][model.id]) result[modelName][model.id] = {};

            Object.keys(model).forEach(function (key) {
                // if member is an object, then we need to extract it into our flattened data
                if ((0, _expandable2.default)(model, key, modelName, oneToOne)) {

                    var mappedKey = (0, _getPropertyTree2.default)(keyToModel, key, modelName, key);
                    // if member is an array, then extract all the models into flattened data
                    if (Array.isArray(model[key])) {
                        // TODO: we should be able to assume a m2m relationship given an array of models, related to an array of models
                        // The challenge well be remembering this relationship. Because once it's in m2m, the models lose reference to the relationship.
                        var foundM2m = (0, _forEachM2mRelation2.default)(mappedKey, manyToMany, function (m2mKey, relativeKey) {
                            if (!result[m2mKey]) result[m2mKey] = {};
                            if (!result[m2mKey][mappedKey]) result[m2mKey][mappedKey] = {};
                            if (!result[m2mKey][relativeKey]) result[m2mKey][relativeKey] = {};
                            result[m2mKey][relativeKey][model.id] = _defineProperty({
                                id: model.id
                            }, mappedKey, model[key].map(function (_ref) {
                                var id = _ref.id;
                                return { id: id };
                            }));
                            model[key].forEach(function (_ref2) {
                                var id = _ref2.id;

                                // Only if we haven't added this models id to the m2m relationship...
                                if (!(0, _getPropertyTree2.default)(result[m2mKey][mappedKey], [], id, relativeKey).find(function (_ref3) {
                                    var id = _ref3.id;
                                    return id === model.id;
                                })) {
                                    // add this model to the m2m relationship.
                                    result[m2mKey][mappedKey][id] = _defineProperty({
                                        id: id
                                    }, relativeKey, [{ id: model.id }]);
                                }
                            });
                        });

                        if (!foundM2m) {
                            result[modelName][model.id][key] = model[key].map(function (_ref4) {
                                var id = _ref4.id;
                                return { id: id };
                            });

                            var mappedModelKey = getMappedKey(keyToModel, mappedKey, (0, _pluralize.singulize)(modelName));
                            flattenArrayOfModels(mappedKey, model[key].map(function (m) {
                                if (!m[mappedModelKey] && !m[modelName]) {
                                    return _extends(_defineProperty({}, mappedModelKey, { id: model.id }), m);
                                } else return m;
                            }));
                            // TODO: NOT DRY
                        } else {
                            var _mappedModelKey = getMappedKey(keyToModel, mappedKey, (0, _pluralize.singulize)(modelName));
                            flattenArrayOfModels(mappedKey, model[key]);
                        }
                        // Else it's a plain object, just recurse
                        // Note: we only continue if we have data to add, otherwise we'd go infinite
                    } else {
                        if (Object.keys(model) >= 1 || !result[(0, _pluralize2.default)(mappedKey)] || !result[(0, _pluralize2.default)(mappedKey)][model[key].id]) {
                            var _mappedModelKey2 = getMappedKey(keyToModel, mappedKey, (0, _pluralize.singulize)(modelName));
                            if (!model[key][_mappedModelKey2] && !model[key][modelName]) {
                                flattenModel((0, _pluralize2.default)(mappedKey), _extends(_defineProperty({}, _mappedModelKey2, { id: model.id }), model[key]));
                            } else {
                                flattenModel((0, _pluralize2.default)(mappedKey), model[key]);
                            };
                        }
                        result[modelName][model.id][key] = { id: model[key].id };
                    }
                } else {
                    result[modelName][model.id][key] = model[key];
                }
            });
        };

        var flattenArrayOfModels = function flattenArrayOfModels(modelName, models) {
            models.forEach(function (model) {
                flattenModel(modelName, model);
            });
        };

        // This is where we start the flattening process.
        if (Array.isArray(data)) {
            flattenArrayOfModels(modelName, data);
        } else {
            flattenModel(modelName, data);
        }

        // We return the result of flattening, which is computer through recursion.
        return result;
    };
};

// TODO: done quickly, prob not best solution.


var getMappedKey = function getMappedKey(keyToModel, modelName, key) {
    var mappedModelKey = key;
    var modelMappedKeys = keyToModel[modelName];
    if (modelMappedKeys) {
        Object.entries(modelMappedKeys).forEach(function (_ref5) {
            var _ref6 = _slicedToArray(_ref5, 2),
                mappedKey = _ref6[0],
                original = _ref6[1];

            if (original === key) {
                mappedModelKey = mappedKey;
            }
        });
    }
    return mappedModelKey;
};