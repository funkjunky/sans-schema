"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Used to determine whether to proceed in a lot of normalization functions
var _default = function _default(model, key, modelName) {
  var oneToOne = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return model[key] !== null && _typeof(model[key]) === 'object' && (!oneToOne[modelName] || !oneToOne[modelName].includes(key));
};

exports.default = _default;