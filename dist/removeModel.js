'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _getPropertyTree = require('./getPropertyTree');

var _getPropertyTree2 = _interopRequireDefault(_getPropertyTree);

var _expandable = require('./expandable');

var _expandable2 = _interopRequireDefault(_expandable);

var _getM2mRelation = require('./getM2mRelation');

var _getM2mRelation2 = _interopRequireDefault(_getM2mRelation);

var _forEachM2mRelation = require('./forEachM2mRelation');

var _forEachM2mRelation2 = _interopRequireDefault(_forEachM2mRelation);

var _pluralize = require('./pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Used to remove / nullify related members
// ie. removeModel dependency, removing from asset.dependencies, etc.
exports.default = function (modelName, model, state) {
    var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var _config$keyToModel = config.keyToModel,
        keyToModel = _config$keyToModel === undefined ? {} : _config$keyToModel,
        _config$oneToOne = config.oneToOne,
        oneToOne = _config$oneToOne === undefined ? {} : _config$oneToOne,
        _config$manyToMany = config.manyToMany,
        manyToMany = _config$manyToMany === undefined ? {} : _config$manyToMany;

    var result = {};

    // manyToMany (m2m may not and often isn't in the object itsself, unless expanded)
    (0, _forEachM2mRelation2.default)(modelName, manyToMany, function (m2mModelKey, otherKey) {
        //TODO: replace m2mModelKet with otherkey
        result[m2mModelKey] = _defineProperty({}, otherKey, {});

        Object.values(state[m2mModelKey][otherKey]).forEach(function (m) {
            var keyModel = result[m2mModelKey][otherKey];
            keyModel[m.id] = _defineProperty({
                id: m.id
            }, modelName, state[m2mModelKey][otherKey][m.id][modelName].filter(function (_ref) {
                var id = _ref.id;
                return id !== model.id;
            }));
        });
    });

    Object.keys(model).forEach(function (key) {
        var mappedKey = (0, _getPropertyTree2.default)(keyToModel, key, modelName, key);

        // if somehow a m2m key got into the object, then ignore it. We handle m2m automatically above.
        if ((0, _getM2mRelation2.default)(modelName, mappedKey, manyToMany)) {
            return;
        }

        // manyToOne
        if (Array.isArray(model[key])) {
            if (!result[mappedKey]) result[mappedKey] = {};

            // nullify the referenced model
            model[key].forEach(function (_ref2) {
                var id = _ref2.id;

                // modelName = 'companies' => 'company' (person['company'] = null)
                result[mappedKey][id] = _defineProperty({ id: id }, (0, _pluralize.singulize)(modelName), null);
            });

            // oneToMany
        } else if (_typeof(model[key]) === 'object') {
            var pluralizedMappedKey = (0, _pluralize2.default)(mappedKey);
            if (!result[pluralizedMappedKey]) result[pluralizedMappedKey] = {};

            var stateEntity = state[pluralizedMappedKey][model[key].id];

            // filter out the referenced model
            result[pluralizedMappedKey][model[key].id] = _defineProperty({
                id: model[key].id
            }, modelName, stateEntity[modelName].filter(function (v) {
                return v.id !== model.id;
            }));
        }
    });

    return result;
};