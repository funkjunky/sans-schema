"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeData = void 0;

var _immer = _interopRequireDefault(require("immer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var mergeMutable = function mergeMutable(oldObj, newObj, key) {
  if (_typeof(newObj[key]) !== 'object' || typeof oldObj[key] === 'undefined') {
    oldObj[key] = newObj[key];
  } else {
    Object.keys(newObj[key]).forEach(function (k) {
      return mergeMutable(oldObj[key], newObj[key], k);
    });
  }
};

var mergeData = function mergeData(oldObj, newObj) {
  return (0, _immer.default)(oldObj, function (draftObj) {
    return Object.keys(newObj).forEach(function (key) {
      return mergeMutable(draftObj, newObj, key);
    });
  });
};

exports.mergeData = mergeData;