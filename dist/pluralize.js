'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (word) {
    var lastLetter = word.slice(-1);

    if (lastLetter === 'y') return word.slice(0, -1) + 'ies';else return word + 's';
};

var singulize = exports.singulize = function singulize(word) {
    if (word.substr(-3) === 'ies') return word.slice(0, -3) + 'y';else return word.slice(0, -1);
};