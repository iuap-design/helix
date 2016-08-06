import {util} from '../util/util';

import {compiler} from './compiler'
import {observe} from './observe'
import {$linkers} from '../linker/linker'

var defComponent = function (ids, component) {
    var $linker = function namedLinker(trueVM, dom, attr, vm) {
        return component.linker(trueVM, dom, attr, vm);
    };
    if (util.isArray(ids)) {
        for (var id of ids) {
            $linkers[id] = $linker;
        }
    } else {
        $linkers[ids] = $linker;
    }
}

var def = function (dom, ctrl) {
    var vm = {};
    if (util.isFunction(ctrl)) {
        ctrl.call(this, vm);
    } else {
        vm = ctrl;
    }

    var trueVM = {};
    compiler.compileView(dom, trueVM, vm);
    observe.defObserve(vm, trueVM);

    // change
    // this.applyVM(trueVM);
    applyVM(trueVM);
    return trueVM;
}

var applyVM = function (vm, event) {
    var len = vm.$$subscriber.length;
    for (var i = 0; i < len; i++) {
        try {
            vm.$$subscriber[i].$apply(event);
        } catch (e) {
            console.error(e);
        }
    }
}

export {defComponent, def, applyVM}
