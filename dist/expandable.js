'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Used to determine whether to proceed in a lot of normalization functions
exports.default = function (model, key, modelName) {
    var oneToOne = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    return model[key] !== null && _typeof(model[key]) === 'object' && (!oneToOne[modelName] || !oneToOne[modelName].includes(key));
};