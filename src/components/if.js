import {getExprFn} from '../core/accessors'
import {applyVM} from './helix'

helix.defComponent("if", {
  linker: function(vm, dom, attr, owner, param) {
    this.attr = owner.attr = attr;
    var expr = attr.when;
    var fn = getExprFn(expr);

    var cns = dom.childNodes;
    return {
      lastVal: undefined,
      $apply: function() {
        var exprVal = fn.call(window, vm);
        if (exprVal != this.lastVal) {
          this.lastVal = exprVal;
          if (exprVal) {
            dom.childNodes = cns;
          } else {
            dom.childNodes = [];
          }
          applyVM(vm);
        }
      },
      getFn: function() {
        return fn;
      },
      getExpr: function() {
        return expr;
      }
    };
  }
});

export default class IFComp extends BaseComponent {

}
