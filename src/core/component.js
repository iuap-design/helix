import {$linkers} from './linker'
import {util} from '../util/util';

export function defComponent(ids, component) {
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
