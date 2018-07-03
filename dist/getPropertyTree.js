"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getPropertyTree = function getPropertyTree(obj, defaultValue) {
    for (var _len = arguments.length, keys = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        keys[_key - 2] = arguments[_key];
    }

    if (!obj) return defaultValue;
    if (!keys.length) return obj;
    var key = keys[0],
        otherKeys = keys.slice(1);

    return getPropertyTree.apply(undefined, [obj[key], defaultValue].concat(_toConsumableArray(otherKeys)));
};

exports.default = getPropertyTree;