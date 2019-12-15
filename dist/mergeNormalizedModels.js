"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MERGE_NORMALIZED_MODELS = void 0;
var MERGE_NORMALIZED_MODELS = 'sans-schema/MERGE_NORMALIZED_MODELS';
exports.MERGE_NORMALIZED_MODELS = MERGE_NORMALIZED_MODELS;

var mergeNormalizedModels = function mergeNormalizedModels(models) {
  return {
    type: MERGE_NORMALIZED_MODELS,
    models: models
  };
};

var _default = mergeNormalizedModels;
exports.default = _default;