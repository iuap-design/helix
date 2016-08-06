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