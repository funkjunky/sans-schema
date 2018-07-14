"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (modelName, m2mModels, cb) {
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