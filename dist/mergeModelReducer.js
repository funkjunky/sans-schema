"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mergeNormalizedModels = require("./mergeNormalizedModels");

var _mergeData = require("./mergeData");

var _default = function _default(modelName) {
  return function (state, action) {
    return action.type === _mergeNormalizedModels.MERGE_NORMALIZED_MODELS && action.models[modelName] ? (0, _mergeData.mergeData)(state, action.models[modelName]) : state;
  };
};

exports.default = _default;