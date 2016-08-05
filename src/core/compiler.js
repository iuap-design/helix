import {util} from '../util/util';
import {$linkers, defaultLinker} from '../linker/linker';

const compiler = {
    compileView: function (dom, vm, owner) {
        vm.$$subscriber = [];

        this.compileDom(dom, vm, owner);
    },
    compileDom: function (dom, vm, owner, param) {
        var childs = dom.childNodes;
        if (!childs) {
            throw new Exception('root dom must have child!');
        }
        var len = childs.length;
        for (var i = 0; i < len; i++) {
            var child = childs[i];
            var attr = child.binds;
            //存在綁定行为
            var currentVM = vm;
            if (!util.isEmptyObject(attr)) {
                var subscriber = this.analyse(child, attr, vm, owner, param);
                if (subscriber)
                    vm.$$subscriber.push(subscriber);
            }
            if (child.childNodes && child.childNodes.length > 0) {
                this.compileDom(child, currentVM, owner, param);
            }
        }
    },
    /**
     * 分析Dom结构,将符合条件的元素和VM进行连接,获得订阅者
     */
    analyse: function (child, attr, vm, owner, param) {
        var tagName = child.nodeName.toLowerCase();
        var $linker = $linkers[tagName] ? $linkers[tagName] : defaultLinker;
        return $linker.call(vm, vm, child, attr, owner, param);
    }
};
export {compiler};
