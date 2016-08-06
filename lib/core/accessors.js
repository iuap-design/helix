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