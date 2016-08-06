'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.applyVM = exports.def = exports.defComponent = undefined;

var _util = require('../util/util');

var _compiler = require('./compiler');

var _observe = require('./observe');

var _linker = require('../linker/linker');

var defComponent = function defComponent(ids, component) {
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
};

var def = function def(dom, ctrl) {
    var vm = {};
    if (_util.util.isFunction(ctrl)) {
        ctrl.call(this, vm);
    } else {
        vm = ctrl;
    }

    var trueVM = {};
    _compiler.compiler.compileView(dom, trueVM, vm);
    _observe.observe.defObserve(vm, trueVM);
    this.applyVM(trueVM);
    return trueVM;
};

var applyVM = function applyVM(vm, event) {
    var len = vm.$$subscriber.length;
    for (var i = 0; i < len; i++) {
        try {
            vm.$$subscriber[i].$apply(event);
        } catch (e) {
            console.error(e);
        }
    }
};

exports.defComponent = defComponent;
exports.def = def;
exports.applyVM = applyVM;