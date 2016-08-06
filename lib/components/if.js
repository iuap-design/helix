'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _accessors = require('../core/accessors');

var _helix = require('./helix');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

helix.defComponent("if", {
  linker: function linker(vm, dom, attr, owner, param) {
    this.attr = owner.attr = attr;
    var expr = attr.when;
    var fn = (0, _accessors.getExprFn)(expr);

    var cns = dom.childNodes;
    return {
      lastVal: undefined,
      $apply: function $apply() {
        var exprVal = fn.call(window, vm);
        if (exprVal != this.lastVal) {
          this.lastVal = exprVal;
          if (exprVal) {
            dom.childNodes = cns;
          } else {
            dom.childNodes = [];
          }
          (0, _helix.applyVM)(vm);
        }
      },
      getFn: function getFn() {
        return fn;
      },
      getExpr: function getExpr() {
        return expr;
      }
    };
  }
});

var IFComp = function (_BaseComponent) {
  _inherits(IFComp, _BaseComponent);

  function IFComp() {
    _classCallCheck(this, IFComp);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(IFComp).apply(this, arguments));
  }

  return IFComp;
}(BaseComponent);

exports.default = IFComp;