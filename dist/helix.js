(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.helix = undefined;
	
	var _dom = __webpack_require__(1);
	
	var _observe = __webpack_require__(2);
	
	var _compiler = __webpack_require__(7);
	
	var _helix = __webpack_require__(6);
	
	var helix = {
	    createElement: _dom.createElement,
	    createComponent: _dom.createComponent,
	    def: _helix.def,
	    defComponent: _helix.defComponent,
	    applyVM: _helix.applyVM
	};
	exports.helix = helix;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var createElement = function createElement(tag, binds, attributes, childs) {
	    return new hdom(tag, binds, attributes, childs);
	};
	
	var createComponent = function createComponent(tag, viewModel) {};
	
	function hdom(tag, binds, attributes, childNodes) {
	    this.nodeName = tag;
	    this.binds = binds;
	    this.attributes = attributes;
	    this.childNodes = childNodes;
	    this.setAttribute = function (k, v) {
	        if (!this.attributes) {
	            this.attributes = {};
	        }
	        this.attributes[k] = v;
	    };
	}
	exports.createElement = createElement;
	exports.createComponent = createComponent;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.observe = undefined;
	
	var _util = __webpack_require__(3);
	
	var _array = __webpack_require__(4);
	
	var _helix = __webpack_require__(6);
	
	var _protoPropNames = ["this", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "toLocaleString", "toString", "valueOf", "constructor"];
	
	var observe = {
	    defObserve: function defObserve(vm, trueVM) {
	        this.defPuppetObject(trueVM, vm, trueVM);
	        return trueVM;
	    },
	    defPuppetObject: function defPuppetObject(puppet, owner, vm) {
	        puppet.$$vm = vm;
	        puppet.$$owner = owner;
	        for (var eleId in owner) {
	            if (eleId.charAt(0) != "$" && _protoPropNames.indexOf(eleId) == -1) {
	                this.defPuppetELement(eleId, owner, vm, puppet);
	            }
	        }
	    },
	    defArrayItem: function defArrayItem(vm, eleId, i, puppetArr, ele) {
	        var puppetObj = {};
	        puppetObj.$$vm = vm;
	        var item = ele[i];
	        Object.defineProperty(puppetObj, "$$prefix", {
	            get: function get() {
	                var _idx = ele.indexOf(item);
	                return eleId + "[" + _idx + "]";
	            }
	        });
	        Array.prototype.splice.call(puppetArr, i, 0, puppetObj);
	        this.defPuppetObject(puppetObj, ele[i], vm);
	        return puppetObj;
	    },
	    defArrayItems: function defArrayItems(vm, eleId, ele, puppetArr) {
	        for (var i = 0, len = ele.length; i < len; i++) {
	            this.defArrayItem(vm, eleId, i, puppetArr, ele);
	        }
	    },
	    defPuppetELement: function defPuppetELement(eleId, owner, vm, puppet) {
	        var ele = owner[eleId];
	        if (_util.util.isArray(ele)) {
	            var expr = puppet.$$prefix ? puppet.$$prefix + "." + eleId : eleId;
	            var puppetArr = new _array.HArray(ele, vm, expr, puppet);
	
	            var obz = {
	                get: function get() {
	                    return puppetArr;
	                },
	                set: function set(newEle) {
	                    var tmpArr = puppetArr;
	                    puppetArr = new _array.HArray(newEle, vm, expr);
	                    $observe.defArrayItems(vm, expr, newEle, puppetArr);
	                    owner[eleId] = newEle;
	                    $observe.onPropertyChange(this, eleId, puppetArr, tmpArr, {
	                        strictExpr: true,
	                        type: "refresh"
	                    });
	                    (0, _helix.applyVM)(vm, {});
	                }
	            };
	            Object.defineProperty(puppet, eleId, obz);
	            this.defArrayItems(vm, expr, ele, puppetArr);
	        } else if (_util.util.isPlainObject(ele)) {
	            var puppetObj = {};
	            puppetObj.$$vm = vm;
	            puppetObj.$$prefix = puppet.$$prefix ? puppet.$$prefix + "." + eleId : eleId;
	            var obz = {
	                get: function get() {
	                    return puppetObj;
	                },
	                set: function set(newEle) {
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
	                    (0, _helix.applyVM)(vm, {});
	                }
	            };
	            Object.defineProperty(puppet, eleId, obz);
	            this.defPuppetObject(puppetObj, ele, vm);
	        } else if (!_util.util.isFunction(ele)) {
	            this.defPuppetProperty(puppet, eleId);
	        }
	    },
	    defPuppetProperty: function defPuppetProperty(puppet, eleId) {
	        var obz = {
	            eleId: eleId,
	            get: function get() {
	                return this.$$owner[eleId];
	            },
	            set: function set(val) {
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
	    onPropertyChange: function onPropertyChange(that, eleId, val, oldVal, e) {
	        var expr = that.$$prefix ? that.$$prefix + "." + eleId : eleId;
	        var event;
	        if (!e) event = {};else event = e;
	        event.eleId = eleId;
	        event.val = val;
	        event.oldVal = oldVal;
	
	        observe.publishPropertyChanged(that.$$vm, expr, event);
	    },
	    publishPropertyChanged: function publishPropertyChanged(vm, expr, event) {
	        var subscr = vm.$$subscriber;
	        var len = subscr.length;
	        var strictExpr = event.strictExpr ? true : false;
	        for (var i = 0; i < len; i++) {
	            var subscrExpr = subscr[i].getExpr();
	            var rat = strictExpr ? subscrExpr === expr : subscrExpr.indexOf(expr) != -1;
	            if (rat) {
	                subscr[i].$apply(event);
	            }
	        }
	    }
	};
	
	exports.observe = observe;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var StringBuffer = function StringBuffer() {
	    var buf = [];
	    this.append = function (str) {
	        buf.push(str);
	        return this;
	    };
	    this.toString = function () {
	        return buf.join("");
	    };
	};
	
	var removeSubScriber = function removeSubScriber(vm, expr) {
	    var arr = vm.$$subscriber;
	    var len = arr.length;
	    var i = 0;
	    while (i < len) {
	        var item = arr[i];
	        var itemExpr = item.getExpr();
	        if (itemExpr && itemExpr.indexOf(expr) != -1) {
	            arr.splice(i, 1);
	            len = arr.length;
	        } else {
	            i++;
	        }
	    }
	};
	
	var class2type = {};
	var types = "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ");
	for (var i = 0; i < types.length; i++) {
	    var name = types[i];
	    class2type["[object " + name + "]"] = name.toLowerCase();
	}
	
	var hasOwn = class2type.hasOwnProperty;
	
	if (!Array.prototype.indexOf) {
	    Array.prototype.indexOf = function (item, index) {
	        var n = this.length,
	            i = ~~index;
	        if (i < 0) i += n;
	        for (; i < n; i++) {
	            if (this[i] === item) return i;
	        }return -1;
	    };
	}
	
	//copy form jquery.
	var util = {
	
	    noop: function noop() {},
	    isFunction: function isFunction(obj) {
	        return util.type(obj) === "function";
	    },
	    isArray: Array.isArray || function (obj) {
	        return util.type(obj) === "array";
	    },
	
	    isWindow: function isWindow(obj) {
	        return obj !== null && obj == obj.window;
	    },
	
	    isNumeric: function isNumeric(obj) {
	
	        var realStringObj = obj && obj.toString();
	        return !util.isArray(obj) && realStringObj - parseFloat(realStringObj) + 1 >= 0;
	    },
	
	    isEmptyObject: function isEmptyObject(obj) {
	        var name;
	        for (name in obj) {
	            return false;
	        }
	        return true;
	    },
	
	    isPlainObject: function isPlainObject(obj) {
	        if (obj && Object.prototype.toString.call(obj) === "[object Object]" && obj.constructor === Object && !hasOwn.call(obj, "constructor")) {
	            var key;
	            for (key in obj) {}
	            return key === undefined || hasOwn.call(obj, key);
	        }
	        return false;
	    },
	
	    type: function type(obj) {
	        if (obj == null) {
	            return obj + "";
	        }
	        return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	    }, extend: function extend() {
	        var src,
	            copyIsArray,
	            copy,
	            name,
	            options,
	            clone,
	            target = arguments[0] || {},
	            i = 1,
	            length = arguments.length,
	            deep = false;
	
	        // Handle a deep copy situation
	        if (typeof target === "boolean") {
	            deep = target;
	
	            // skip the boolean and the target
	            target = arguments[i] || {};
	            i++;
	        }
	
	        // Handle case when target is a string or something (possible in deep copy)
	        if ((typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object" && !util.isFunction(target)) {
	            target = {};
	        }
	
	        if (i === length) {
	            target = this;
	            i--;
	        }
	
	        for (; i < length; i++) {
	            // Only deal with non-null/undefined values
	            if ((options = arguments[i]) != null) {
	                // Extend the base object
	                for (name in options) {
	                    src = target[name];
	                    copy = options[name];
	
	                    // Prevent never-ending loop
	                    if (target === copy) {
	                        continue;
	                    }
	
	                    // Recurse if we're merging plain objects or arrays
	                    if (deep && copy && (util.isPlainObject(copy) || (copyIsArray = util.isArray(copy)))) {
	                        if (copyIsArray) {
	                            copyIsArray = false;
	                            clone = src && util.isArray(src) ? src : [];
	                        } else {
	                            clone = src && util.isPlainObject(src) ? src : {};
	                        }
	
	                        // Never move original objects, clone them
	                        target[name] = util.extend(deep, clone, copy);
	
	                        // Don't bring in undefined values
	                    } else if (copy !== undefined) {
	                        target[name] = copy;
	                    }
	                }
	            }
	        }
	
	        // Return the modified object
	        return target;
	    }
	
	};
	exports.StringBuffer = StringBuffer;
	exports.removeSubScriber = removeSubScriber;
	exports.util = util;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.HArray = HArray;
	
	var _accessors = __webpack_require__(5);
	
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

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var getterCache = {};
	var setterCache = {};
	
	var createGetterExpr = function createGetterExpr(expr) {
	    if (!getterCache.hasOwnProperty(expr)) {
	        var funBody = "var $$$rsl = $$$obj." + expr + ";return $$$rsl;";
	        var fun = new Function("$$$obj", funBody);
	        getterCache[expr] = fun;
	    }
	    return getterCache[expr];
	};
	
	var createSetterExpr = function createSetterExpr(expr) {
	    if (!setterCache.hasOwnProperty(expr)) {
	        var funBody = "$$$obj." + expr + "=$$$val;return;";
	        var fun = new Function("$$$obj", "$$$val", funBody);
	        setterCache[expr] = fun;
	    }
	    return setterCache[expr];
	};
	var getExprFn = function getExprFn(expr) {
	    return createGetterExpr(expr);
	};
	exports.createGetterExpr = createGetterExpr;
	exports.createSetterExpr = createSetterExpr;
	exports.getExprFn = getExprFn;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.defComponent = defComponent;
	exports.def = def;
	exports.applyVM = applyVM;
	
	var _util = __webpack_require__(3);
	
	var _compiler = __webpack_require__(7);
	
	var _observe = __webpack_require__(2);
	
	var _linker = __webpack_require__(8);
	
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
	
	function def(dom, ctrl) {
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
	}
	function applyVM(vm, event) {
	    var len = vm.$$subscriber.length;
	    for (var i = 0; i < len; i++) {
	        try {
	            vm.$$subscriber[i].$apply(event);
	        } catch (e) {
	            console.error(e);
	        }
	    }
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.compiler = undefined;
	
	var _util = __webpack_require__(3);
	
	var _linker = __webpack_require__(8);
	
	var compiler = {
	    compileView: function compileView(dom, vm, owner) {
	        vm.$$subscriber = [];
	
	        this.compileDom(dom, vm, owner);
	    },
	    compileDom: function compileDom(dom, vm, owner, param) {
	        var childs = dom.childNodes;
	        if (!childs) {
	            throw new Exception('dom must have child!');
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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.$linkers = undefined;
	exports.defaultLinker = defaultLinker;
	
	var _accessors = __webpack_require__(5);
	
	var $linkers = exports.$linkers = {};
	
	function defaultLinker(vm, dom, attr, owner, sparam) {
	    var expr = attr.text ? attr.text : attr.bind;
	    var fn = (0, _accessors.getExprFn)(expr);
	    var param = sparam;
	    var tagName = dom.nodeName.toLowerCase();
	    var trueExpr = expr;
	    var dynExpr = false;
	    if (param && param.exprMatch == expr.match(/[a-z0-9A-Z_]*/g)[0]) dynExpr = true;
	
	    dom.setAttribute("expr", trueExpr);
	    return {
	        $apply: function $apply() {
	            var val = fn.call(null, vm);
	            dom.setAttribute("text", val);
	        },
	        getFn: function getFn() {
	            return fn;
	        },
	        getExpr: function getExpr() {
	            if (dynExpr) trueExpr = expr.replace(param.exprMatch, param.prefix);
	            return trueExpr;
	        }
	    };
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=helix.js.map