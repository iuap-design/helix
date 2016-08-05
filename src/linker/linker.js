import {getExprFn} from '../core/accessors'
export var $linkers = {};

export function defaultLinker(vm, dom, attr, owner, sparam) {
    var expr = attr.text ? attr.text : attr.bind;
    var fn = getExprFn(expr);
    var param = sparam;
    var tagName = dom.nodeName.toLowerCase();
    var trueExpr = expr;
    var dynExpr = false;
    if (param && param.exprMatch == expr.match(/[a-z0-9A-Z_]*/g)[0])
        dynExpr = true;

    dom.setAttribute("expr", trueExpr);
    return {
        $apply: function () {
            var val = fn.call(null, vm);
            dom.setAttribute("text", val);
        },
        getFn: function () {
            return fn;
        },
        getExpr: function () {
            if (dynExpr)
                trueExpr = expr.replace(param.exprMatch, param.prefix);
            return trueExpr;
        }
    };

}
