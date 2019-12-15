"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pluralize = _interopRequireDefault(require("./pluralize"));

var _getPropertyTree = _interopRequireDefault(require("./getPropertyTree"));

var _expandable = _interopRequireDefault(require("./expandable"));

var _forEachM2mRelation = _interopRequireDefault(require("./forEachM2mRelation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Function that expands things based on keyToModel
// Deepness 1: { id: 1 } => { id: 1, name: 'thing', commit: { id: 2 } }
// Deepness 2: { id: 1 } => { id: 1, name: 'thing', commit: { id: 2, version: 2, message: 'hello' } }
var _default = function _default(modelName, model, state) {
  var deepness = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;
  var config = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var _config$keyToModel = config.keyToModel,
      keyToModel = _config$keyToModel === void 0 ? {} : _config$keyToModel,
      _config$oneToOne = config.oneToOne,
      oneToOne = _config$oneToOne === void 0 ? {} : _config$oneToOne,
      _config$manyToMany = config.manyToMany,
      manyToMany = _config$manyToMany === void 0 ? {} : _config$manyToMany; //TODO: defining _expandModel function every call seems ineffecient

  var _expandModel = function _expandModel(modelName, model, deepness) {
    // If we've expanded as deep as asked, then we're done! Return the model as-is
    if (deepness === 0) return model; // Grab the model from the store, if it doesn't exist, then return the model as-is

    var storeModel = state[modelName][model.id];
    if (!storeModel) return model;
    var newModel = Object.assign({}, storeModel);
    Object.keys(newModel).forEach(function (key) {
      if (!(0, _expandable.default)(storeModel, key, modelName, oneToOne)) return; //get the model name for the key, for example work_commit => commits

      var modelKey = (0, _getPropertyTree.default)(keyToModel, key, modelName, key);

      if (Array.isArray(newModel[key])) {
        //for each model in the array, expand it further
        newModel[key] = newModel[key].map(function (keyModel) {
          return _expandModel(modelKey, keyModel, deepness - 1);
        });
      } else if (_typeof(newModel[key]) === 'object') {
        newModel[key] = _expandModel((0, _pluralize.default)(modelKey), newModel[key], deepness - 1);
      }
    }); // Check for many to many

    (0, _forEachM2mRelation.default)(modelName, manyToMany, function (m2mKey, key, origKey) {
      var modelNameKey = Object.entries(manyToMany[m2mKey]).find(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            k = _ref2[0],
            v = _ref2[1];

        return k !== modelName;
      })[1]; // If an m2mKey exists, but is empty, then you can end up with one side having zero relations. This check is for that.

      if (state[m2mKey][modelNameKey][model.id]) {
        newModel[key] = state[m2mKey][modelNameKey][model.id][key].map(function (model) {
          return _expandModel(origKey, model, deepness - 1);
        });
      } else {
        newModel[key] = [];
      }
    });
    return newModel;
  }; // Start the recursion... and return it when done.


  return _expandModel(modelName, model, deepness);
};

exports.default = _default;