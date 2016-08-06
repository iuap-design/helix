'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compiler = undefined;

var _util = require('../util/util');

var _linker = require('../linker/linker');

var compiler = {
    compileView: function compileView(dom, vm, owner) {
        vm.$$subscriber = [];

        this.compileDom(dom, vm, owner);
    },
    compileDom: function compileDom(dom, vm, owner, param) {
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
            if (!_util.util.isEmptyObject(attr)) {
                var subscriber = this.analyse(child, attr, vm, owner, param);
                if (subscriber) vm.$$subscriber.push(subscriber);
            }
            if (child.childNodes && child.childNodes.length > 0) {
                this.compileDom(child, currentVM, owner, param);
            }
        }
    },
    /**
     * 分析Dom结构,将符合条件的元素和VM进行连接,获得订阅者
     */
    analyse: function analyse(child, attr, vm, owner, param) {
        var tagName = child.nodeName.toLowerCase();
        var $linker = _linker.$linkers[tagName] ? _linker.$linkers[tagName] : _linker.defaultLinker;
        return $linker.call(vm, vm, child, attr, owner, param);
    }
};
exports.compiler = compiler;