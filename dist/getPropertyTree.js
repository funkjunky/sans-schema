"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var getPropertyTree = function getPropertyTree(obj, defaultValue) {
  if (!obj) return defaultValue;

  for (var _len = arguments.length, keys = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    keys[_key - 2] = arguments[_key];
  }

  if (!keys.length) return obj;
  var key = keys[0],
      otherKeys = keys.slice(1);
  return getPropertyTree.apply(void 0, [obj[key], defaultValue].concat(_toConsumableArray(otherKeys)));
};

var _default = getPropertyTree;
exports.default = _default;