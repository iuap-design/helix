var getterCache = {};
var setterCache = {};

var createGetterExpr = function (expr) {
    if (!getterCache.hasOwnProperty(expr)) {
        var funBody = "var $$$rsl = $$$obj." + expr + ";return $$$rsl;";
        var fun = new Function("$$$obj", funBody);
        getterCache[expr] = fun;
    }
    return getterCache[expr];
};

var createSetterExpr = function (expr) {
    if (!setterCache.hasOwnProperty(expr)) {
        var funBody = "$$$obj." + expr + "=$$$val;return;";
        var fun = new Function("$$$obj", "$$$val", funBody);
        setterCache[expr] = fun;
    }
    return setterCache[expr];
};
var getExprFn = function (expr) {
    return createGetterExpr(expr);
};
export {createGetterExpr, createSetterExpr, getExprFn};
