import {util} from '../util/util';
import {HArray} from './array';


import {applyVM} from './helix'

const _protoPropNames = ["this", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "toLocaleString", "toString", "valueOf", "constructor"];

const observe = {
    defObserve: function (vm, trueVM) {
        this.defPuppetObject(trueVM, vm, trueVM);
        return trueVM;
    },
    defPuppetObject: function (puppet, owner, vm) {
        puppet.$$vm = vm;
        puppet.$$owner = owner;
        for (var eleId in owner) {
            if (eleId.charAt(0) != "$" && _protoPropNames.indexOf(eleId) == -1) {
                this.defPuppetELement(eleId, owner, vm, puppet);
            }
        }
    },
    defArrayItem: function (vm, eleId, i, puppetArr, ele) {
        var puppetObj = {};
        puppetObj.$$vm = vm;
        var item = ele[i];
        Object.defineProperty(puppetObj, "$$prefix", {
            get: function () {
                var _idx = ele.indexOf(item);
                return eleId + "[" + _idx + "]";
            }
        });
        Array.prototype.splice.call(puppetArr, i, 0, puppetObj);
        this.defPuppetObject(puppetObj, ele[i], vm);
        return puppetObj;
    },
    defArrayItems: function (vm, eleId, ele, puppetArr) {
        for (var i = 0, len = ele.length; i < len; i++) {
            this.defArrayItem(vm, eleId, i, puppetArr, ele);
        }
    },
    defPuppetELement: function (eleId, owner, vm, puppet) {
        var ele = owner[eleId];
        if (util.isArray(ele)) {
            var expr = puppet.$$prefix ? puppet.$$prefix + "." + eleId : eleId;
            var puppetArr = new HArray(ele, vm, expr, puppet);

            var obz = {
                get: function () {
                    return puppetArr;
                },
                set: function (newEle) {
                    var tmpArr = puppetArr;
                    puppetArr = new HArray(newEle, vm, expr);
                    $observe.defArrayItems(vm, expr, newEle, puppetArr);
                    owner[eleId] = newEle;
                    $observe.onPropertyChange(this, eleId, puppetArr, tmpArr, {
                        strictExpr: true,
                        type: "refresh"
                    });
                    applyVM(vm, {});

                }
            };
            Object.defineProperty(puppet, eleId, obz);
            this.defArrayItems(vm, expr, ele, puppetArr);

        } else if (util.isPlainObject(ele)) {
            var puppetObj = {};
            puppetObj.$$vm = vm;
            puppetObj.$$prefix = puppet.$$prefix ? puppet.$$prefix + "." + eleId : eleId;
            var obz = {
                get: function () {
                    return puppetObj;
                },
                set: function (newEle) {
                    var tmpPuppetObj = puppetObj;
                    puppetObj = {};
                    puppetObj.$$vm = vm;
                    puppetObj.$$prefix = puppet.$$prefix ? puppet.$$prefix + "." + eleId : eleId;
                    owner[eleId] = newEle;
                    observe.defPuppetObject(puppetObj, newEle, vm);
                    observe.onPropertyChange(this, eleId, puppetObj, tmpPuppetObj, {
                        strictExpr: false,
                        type: "refresh"
                    });
                    applyVM(vm, {});

                }
            };
            Object.defineProperty(puppet, eleId, obz);
            this.defPuppetObject(puppetObj, ele, vm);
        } else if (!util.isFunction(ele)) {
            this.defPuppetProperty(puppet, eleId);
        }
    },
    defPuppetProperty: function (puppet, eleId) {
        var obz = {
            eleId: eleId,
            get: function () {
                return this.$$owner[eleId];
            },
            set: function (val) {
                var oldVal = this.$$owner[eleId];
                if (oldVal != val) {
                    var that = this;
                    that.$$owner[eleId] = val;
                    observe.onPropertyChange(that, eleId, val, oldVal);
                }
            }
        };
        Object.defineProperty(puppet, eleId, obz);
    },
    onPropertyChange: function (that, eleId, val, oldVal, e) {
        var expr = that.$$prefix ? that.$$prefix + "." + eleId : eleId;
        var event;
        if (!e)
            event = {};
        else
            event = e;
        event.eleId = eleId;
        event.val = val;
        event.oldVal = oldVal;

        observe.publishPropertyChanged(that.$$vm, expr, event);
    },
    publishPropertyChanged: function (vm, expr, event) {
        var subscr = vm.$$subscriber;
        var len = subscr.length;
        var strictExpr = event.strictExpr ? true : false;
        for (var i = 0; i < len; i++) {
            var subscrExpr = subscr[i].getExpr();
            var rat = strictExpr ? (subscrExpr === expr) : (subscrExpr.indexOf(expr) != -1);
            if (rat) {
                subscr[i].$apply(event);
            }
        }
    }
};

export  {observe};
