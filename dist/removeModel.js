"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _getPropertyTree = _interopRequireDefault(require("./getPropertyTree"));

var _expandable = _interopRequireDefault(require("./expandable"));

var _getM2mRelation = _interopRequireDefault(require("./getM2mRelation"));

var _forEachM2mRelation = _interopRequireDefault(require("./forEachM2mRelation"));

var _pluralize = _interopRequireWildcard(require("./pluralize"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Used to remove / nullify related members
// ie. removeModel dependency, removing from asset.dependencies, etc.
var _default = function _default(modelName, model, state) {
  var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _config$keyToModel = config.keyToModel,
      keyToModel = _config$keyToModel === void 0 ? {} : _config$keyToModel,
      _config$oneToOne = config.oneToOne,
      oneToOne = _config$oneToOne === void 0 ? {} : _config$oneToOne,
      _config$manyToMany = config.manyToMany,
      manyToMany = _config$manyToMany === void 0 ? {} : _config$manyToMany;
  var result = {}; // manyToMany (m2m may not and often isn't in the object itsself, unless expanded)

  (0, _forEachM2mRelation.default)(modelName, manyToMany, function (m2mModelKey, otherKey) {
    //TODO: replace m2mModelKet with otherkey
    result[m2mModelKey] = _defineProperty({}, otherKey, {});
    Object.values(state[m2mModelKey][otherKey]).forEach(function (m) {
      var modelNameAlias = manyToMany[m2mModelKey][otherKey];
      var keyModel = result[m2mModelKey][otherKey];
      keyModel[m.id] = _defineProperty({
        id: m.id
      }, modelNameAlias, state[m2mModelKey][otherKey][m.id][modelNameAlias].filter(function (_ref) {
        var id = _ref.id;
        return id !== model.id;
      }));
    });
  });
  var fullModel = state[modelName][model.id];
  Object.keys(fullModel).forEach(function (key) {
    var mappedKey = (0, _getPropertyTree.default)(keyToModel, key, modelName, key); // if somehow a m2m key got into the object, then ignore it. We handle m2m automatically above.

    if ((0, _getM2mRelation.default)(modelName, mappedKey, manyToMany)) {
      return;
    } // manyToOne


    if (Array.isArray(fullModel[key])) {
      if (!result[mappedKey]) result[mappedKey] = {}; // nullify the referenced model

      fullModel[key].forEach(function (_ref2) {
        var id = _ref2.id;
        // modelName = 'companies' => 'company' (person['company'] = null)
        result[mappedKey][id] = _defineProperty({
          id: id
        }, (0, _pluralize.singulize)(modelName), null);
      }); // oneToMany
    } else if (_typeof(fullModel[key]) === 'object') {
      var pluralizedMappedKey = (0, _pluralize.default)(mappedKey);
      if (!result[pluralizedMappedKey]) result[pluralizedMappedKey] = {};
      var stateEntity = state[pluralizedMappedKey][fullModel[key].id]; // filter out the referenced model

      result[pluralizedMappedKey][fullModel[key].id] = _defineProperty({
        id: fullModel[key].id
      }, modelName, stateEntity[modelName].filter(function (v) {
        return v.id !== fullModel.id;
      }));
    }
  });
  return result;
};

exports.default = _default;