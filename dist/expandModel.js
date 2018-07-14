'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _pluralize = require('./pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _getPropertyTree = require('./getPropertyTree');

var _getPropertyTree2 = _interopRequireDefault(_getPropertyTree);

var _expandable = require('./expandable');

var _expandable2 = _interopRequireDefault(_expandable);

var _forEachM2mRelation = require('./forEachM2mRelation');

var _forEachM2mRelation2 = _interopRequireDefault(_forEachM2mRelation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Function that expands things based on keyToModel
// Deepness 1: { id: 1 } => { id: 1, name: 'thing', commit: { id: 2 } }
// Deepness 2: { id: 1 } => { id: 1, name: 'thing', commit: { id: 2, version: 2, message: 'hello' } }
exports.default = function (modelName, model, state) {
    var deepness = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;
    var config = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var _config$keyToModel = config.keyToModel,
        keyToModel = _config$keyToModel === undefined ? {} : _config$keyToModel,
        _config$oneToOne = config.oneToOne,
        oneToOne = _config$oneToOne === undefined ? {} : _config$oneToOne,
        _config$manyToMany = config.manyToMany,
        manyToMany = _config$manyToMany === undefined ? {} : _config$manyToMany;

    //TODO: defining _expandModel function every call seems ineffecient

    var _expandModel = function _expandModel(modelName, model, deepness) {
        // If we've expanded as deep as asked, then we're done! Return the model as-is
        if (deepness === 0) return model;

        // Grab the model from the store, if it doesn't exist, then return the model as-is
        var storeModel = state[modelName][model.id];
        if (!storeModel) return model;

        var newModel = Object.assign({}, storeModel);
        Object.keys(newModel).forEach(function (key) {
            if (!(0, _expandable2.default)(storeModel, key, modelName, oneToOne)) return;

            //get the model name for the key, for example work_commit => commits
            var modelKey = (0, _getPropertyTree2.default)(keyToModel, key, modelName, key);
            if (Array.isArray(newModel[key])) {
                //for each model in the array, expand it further
                newModel[key] = newModel[key].map(function (keyModel) {
                    return _expandModel(modelKey, keyModel, deepness - 1);
                });
            } else if (_typeof(newModel[key]) === 'object') {
                newModel[key] = _expandModel((0, _pluralize2.default)(modelKey), newModel[key], deepness - 1);
            }
        });

        // Check for many to many
        (0, _forEachM2mRelation2.default)(modelName, manyToMany, function (m2mKey, key, origKey) {
            var modelNameKey = Object.entries(manyToMany[m2mKey]).find(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    k = _ref2[0],
                    v = _ref2[1];

                return k !== modelName;
            })[1];
            // If an m2mKey exists, but is empty, then you can end up with one side having zero relations. This check is for that.
            if (state[m2mKey][modelNameKey][model.id]) {
                newModel[key] = state[m2mKey][modelNameKey][model.id][key].map(function (model) {
                    return _expandModel(origKey, model, deepness - 1);
                });
            } else {
                newModel[key] = [];
            }
        });

        return newModel;
    };

    // Start the recursion... and return it when done.
    return _expandModel(modelName, model, deepness);
};