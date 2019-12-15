"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _default = function _default(modelName, m2mModels, cb) {
  var m2mRelationships = Object.entries(m2mModels).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        m2mKey = _ref2[0],
        relationships = _ref2[1];

    return Object.keys(relationships).includes(modelName);
  });
  m2mRelationships.forEach(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        m2mKey = _ref4[0],
        relationships = _ref4[1];

    var otherModelName = Object.keys(relationships).find(function (k) {
      return k !== modelName;
    });
    cb(m2mKey, relationships[modelName], otherModelName);
  });
  return m2mRelationships.length > 0;
};

exports.default = _default;