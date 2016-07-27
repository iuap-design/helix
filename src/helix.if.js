/**
 * helix IF Component
 * @param {Object} helix
 */
(function(helix) {
	"use strict";
	helix.defComponent("if", {
		linker: function(vm, dom, attr, owner, param) {
			this.attr = owner.attr = attr;
			var expr = attr.when;
			var fn = helix.util.getExprFn(expr);
			var childs = [];
			var cns = dom.childNodes;
			traverseDom(cns, function(li) {
				childs.push(li);
			},false)

			return {
				lastVal: undefined,
				$apply: function() {
					var exprVal = fn.call(window, vm);
					if (exprVal != this.lastVal) {
						this.lastVal = exprVal;
						if (exprVal) {
							dom.innerHTML = "";
							var dg = document.createDocumentFragment();
							traverseDom(childs, function(li) {
								dg.appendChild(li);
							},false)
							dom.appendChild(dg);
						} else {
							dom.innerHTML = "";
						}
						window.helix.applyVM(vm)
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
	})
})(window.hi)