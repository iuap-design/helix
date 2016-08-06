"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HArray = HArray;

var _accessors = require("./accessors");

function HArray(arr, vm, expr, puppet) {
    this.$$vm = vm;
    this.$$prefix = expr;

    this.$$expr = expr;
    /**
     * 原对象的拷贝
     */
    this.$$model = arr;

    /**
     * 备份方法
     */
    this._push = Array.prototype.push;
    this._pop = Array.prototype.pop;
    this._reverse = Array.prototype.reverse;

    this._shift = Array.prototype.shift;
    this._unshift = Array.prototype.unshift;
    this._splice = Array.prototype.splice;
    this.join = Array.prototype.join;
    this.concat = Array.prototype.concat;
    this.notify = function (event) {
        $helix.publishPropertyChanged(this.$$vm, this.$$expr, event);
    };
    this.pop = function () {
        var lastObj = this.$$model[this.$$model.length - 1];
        this.splice(this.$$model.length - 1, 1);
        return lastObj;
    };
    this.push = function () {
        var oriLen = this.$$model.length;
        var newLen = this._push.apply(this.$$model, arguments);
        var that = this;
        $.each(arguments, function (i, ele) {
            $helix.defArrayItem(that.$$vm, that.$$expr, oriLen + i, that, that.$$model);
        });
        this.notify({
            type: "push",
            param: {
                oriLen: oriLen,
                newLen: newLen,
                element: arguments
            },
            strictExpr: true
        });
        $helix.applyVM(vm, {});
        return newLen;
    };
    this.reverse = function () {
        this.$$model.reverse();
        var setter = (0, _accessors.createSetterExpr)(this.$$expr);
        setter.call(this.$$vm, this.$$vm, this.$$model);
    };
    this.shift = function () {
        var lastObj = this.$$model[this.$$model.length - 1];
        this.splice(0, 1);
        return lastObj;
    };
    this.unshift = function (obj) {
        this.splice(0, 0, obj);
    };
    this.removeAll = function () {
        this.splice(0, this.$$model.length);
    };
    this.addAll = function () {
        this.splice(0, 0, obj);
    };
    this.item = function (i, obj) {
        if (obj) {
            this.splice(i, 1, obj);
        }
        return this[i];
    };
    this.size = function (len) {
        if (len && !isNaN(len)) {
            this.splice(len, this.$$model.length - len);
        }
        return this.$$model.length;
    };
    this.splice = function () {
        var index = arguments[0];
        var howmany = arguments[1];
        if (howmany === undefined) return;
        var items = Array.prototype.slice.call(arguments, 2);
        if (howmany > 0) {
            /**--remove--**/
            Array.prototype.splice.call(this, index, howmany);
            Array.prototype.splice.call(this.$$model, index, howmany);
            var setter = (0, _accessors.createSetterExpr)(this.$$expr);
            setter.call(this.$$vm, this.$$vm.$$owner, this.$$model);
            for (var i = 0; i < howmany; i++) {
                this.notify({
                    type: "remove",
                    param: {
                        index: index
                    },
                    strictExpr: true
                });
                var itemExpr = this.$$expr + "[-1]";
                //销毁订阅者;
                $helix.util.removeSubScriber(this.$$vm, itemExpr);
            }
            /**--remove--**/
        }
        if (items.length > 0) {
            /**--insert--**/
            arguments[1] = 0;
            var that = this;
            Array.prototype.splice.apply(that.$$model, arguments);
            var asetter = (0, _accessors.createSetterExpr)(this.$$expr);
            asetter.call(this.$$vm, this.$$vm.$$owner, this.$$model);

            $.each(items, function (i, ele) {
                $helix.defArrayItem(that.$$vm, that.$$expr, index + i, that, that.$$model);
            });

            this.notify({
                type: "insert",
                param: {
                    oriLen: index,
                    index: index,
                    newLen: that.$$model.length,
                    element: items
                },
                strictExpr: true
            });
            /**--insert--**/
        }
        $helix.applyVM(vm, {});
    };
}