"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pluralize = _interopRequireWildcard(require("./pluralize.js"));

var _getPropertyTree = _interopRequireDefault(require("./getPropertyTree.js"));

var _expandable = _interopRequireDefault(require("./expandable"));

var _forEachM2mRelation = _interopRequireDefault(require("./forEachM2mRelation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
var _default = function _default(modelName) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (data) {
    var _config$models = config.models,
        models = _config$models === void 0 ? [] : _config$models,
        _config$oneToOne = config.oneToOne,
        oneToOne = _config$oneToOne === void 0 ? {} : _config$oneToOne,
        _config$keyToModel = config.keyToModel,
        keyToModel = _config$keyToModel === void 0 ? {} : _config$keyToModel,
        _config$manyToMany = config.manyToMany,
        manyToMany = _config$manyToMany === void 0 ? {} : _config$manyToMany;
    var result = {};

    var flattenModel = function flattenModel(modelName, model) {
      if (models.length && !models.includes(modelName)) {
        console.warn('model name doesnt exist: ', modelName);
        return;
      }

      if (!model.id) return; // if first model of type modelName, then create the modelName hash

      if (!result[modelName]) result[modelName] = {}; // if it's the first model with this ide, then create the model object

      if (!result[modelName][model.id]) result[modelName][model.id] = {};
      Object.keys(model).forEach(function (key) {
        // if member is an object, then we need to extract it into our flattened data
        if ((0, _expandable.default)(model, key, modelName, oneToOne)) {
          var mappedKey = (0, _getPropertyTree.default)(keyToModel, key, modelName, key); // if member is an array, then extract all the models into flattened data

          if (Array.isArray(model[key])) {
            var m2mRelation = Object.entries(manyToMany).find(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  m2mKey = _ref2[0],
                  relations = _ref2[1];

              return Object.values(relations).includes(key);
            });

            if (m2mRelation) {
              var m2mKey = m2mRelation[0]; // Note: this is a bit of a mind fuck... we want the key for the value that is NOT the key we provided. Because m2m key points to the referenced key alias.
              // persons: favourites
              // hockeyTeams: fans
              // We have "favourites", we need hockeyTeams, which is what favourites represents and we need fans, which is the alias for persons.

              var _Object$entries$find = Object.entries(m2mRelation[1]).find(function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 2),
                    k = _ref4[0],
                    v = _ref4[1];

                return v !== key;
              }),
                  _Object$entries$find2 = _slicedToArray(_Object$entries$find, 2),
                  m2mRelatedModelName = _Object$entries$find2[0],
                  m2mModelAlias = _Object$entries$find2[1];

              if (!result[m2mKey]) result[m2mKey] = {};
              if (!result[m2mKey][key]) result[m2mKey][key] = {};
              if (!result[m2mKey][m2mModelAlias]) result[m2mKey][m2mModelAlias] = {};
              result[m2mKey][m2mModelAlias][model.id] = _defineProperty({
                id: model.id
              }, key, model[key].map(function (_ref5) {
                var id = _ref5.id;
                return {
                  id: id
                };
              }));
              model[key].forEach(function (_ref6) {
                var id = _ref6.id;

                // Only if we haven't added this models id to the m2m relationship...
                if (!(0, _getPropertyTree.default)(result[m2mKey][key], [], id, m2mModelAlias).find(function (_ref7) {
                  var id = _ref7.id;
                  return id === model.id;
                })) {
                  // add this model to the m2m relationship.
                  result[m2mKey][key][id] = _defineProperty({
                    id: id
                  }, m2mModelAlias, [{
                    id: model.id
                  }]);
                }
              });
              flattenArrayOfModels(m2mRelatedModelName, model[key]);
            } else {
              result[modelName][model.id][key] = model[key].map(function (_ref8) {
                var id = _ref8.id;
                return {
                  id: id
                };
              });
              var mappedModelKey = getMappedKey(keyToModel, mappedKey, (0, _pluralize.singulize)(modelName));
              flattenArrayOfModels(mappedKey, model[key].map(function (m) {
                if (!m[mappedModelKey] && !m[modelName]) {
                  return _objectSpread(_defineProperty({}, mappedModelKey, {
                    id: model.id
                  }), m);
                } else return m;
              }));
            } // Else it's a plain object, just recurse
            // Note: we only continue if we have data to add, otherwise we'd go infinite

          } else {
            if (Object.keys(model) >= 1 || !result[(0, _pluralize.default)(mappedKey)] || !result[(0, _pluralize.default)(mappedKey)][model[key].id]) {
              //we have modelName, key (key could be alias), we need realKey, we need modelName's alias under realKey
              var realKey = (0, _pluralize.default)((0, _getPropertyTree.default)(keyToModel, key, modelName, key));
              var modelNameAlias = (Object.entries(keyToModel[realKey] || []).find(function (_ref9) {
                var _ref10 = _slicedToArray(_ref9, 2),
                    k = _ref10[0],
                    v = _ref10[1];

                return v === modelName;
              }) || [modelName])[0];
              flattenModel(realKey, _objectSpread(_defineProperty({}, modelNameAlias, [{
                id: model.id
              }]), model[key]));
            }

            result[modelName][model.id][key] = {
              id: model[key].id
            };
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
    }; // This is where we start the flattening process.


    if (Array.isArray(data)) {
      flattenArrayOfModels(modelName, data);
    } else {
      flattenModel(modelName, data);
    } // We return the result of flattening, which is computer through recursion.


    return result;
  };
}; // TODO: done quickly, prob not best solution.


exports.default = _default;

var getMappedKey = function getMappedKey(keyToModel, modelName, key) {
  var mappedModelKey = key;
  var modelMappedKeys = keyToModel[modelName];

  if (modelMappedKeys) {
    Object.entries(modelMappedKeys).forEach(function (_ref11) {
      var _ref12 = _slicedToArray(_ref11, 2),
          mappedKey = _ref12[0],
          original = _ref12[1];

      if (original === key) {
        mappedModelKey = mappedKey;
      }
    });
  }

  return mappedModelKey;
};