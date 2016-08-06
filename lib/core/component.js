'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defComponent = defComponent;

var _linker = require('./linker');

var _util = require('../util/util');

function defComponent(ids, component) {
    var $linker = function namedLinker(trueVM, dom, attr, vm) {
        return component.linker(trueVM, dom, attr, vm);
    };
    if (_util.util.isArray(ids)) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = ids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var id = _step.value;

                _linker.$linkers[id] = $linker;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    } else {
        _linker.$linkers[ids] = $linker;
    }
}