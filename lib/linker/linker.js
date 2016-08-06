"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.$linkers = undefined;
exports.defaultLinker = defaultLinker;

var _accessors = require("../core/accessors");

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