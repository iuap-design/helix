"use strict";

var _accessors = require("../core/accessors");

helix.defComponent(["list", "tbody"], {
	linker: function linker(vm, dom, attr, owner, param) {
		this.attr = owner.attr = attr;
		var expr = attr.items;
		if (!expr) return;
		var fn = (0, _accessors.getExprFn)(expr);
		var childs = [];
		/**
   * 根据Child创建的
   */
		var childFragments = [];
		var childVMs = [];
		var childNodes = dom.childNodes;
		/**
   * 临时变量名
   */
		var itemName = attr.item;

		/**
   * 将Dom对象做动态模板使用.
   */
		var $$$itemflag$$$ = document.createComment("$$$itemflag$$$");
		childs.push($$$itemflag$$$);
		traverseDom(childNodes, function (li) {
			childs.push(li);
		}, true);
		/**
   * 清空Children
   */
		dom.innerHTML = "";
		/**
   * 获取指定的数组
   */

		var items = fn.call(window, owner);
		var arr = items;
		var domQ = $(dom);
		var createTmpFragment = function createTmpFragment(i) {
			var item = arr[i];
			var tmpVmFun = function tmpVmFun() {};
			tmpVmFun.prototype = vm;
			var tmpVM = new tmpVmFun();

			Object.defineProperty(tmpVM, "$index", {
				get: function get() {
					return arr.indexOf(item);
				}
			});

			Object.defineProperty(tmpVM, "$isFirst", {
				get: function get() {
					return tmpVM.$index == 0;
				}
			});
			Object.defineProperty(tmpVM, "$isLast", {
				get: function get() {
					return tmpVM.$index == len - 1;
				}
			});

			/**
    * 创建Puppet
    */
			var tmpOwnerFun = function tmpOwnerFun() {};
			tmpOwnerFun.prototype = owner;
			var tmpOwner = new tmpOwnerFun();
			tmpOwner[itemName] = item;
			tmpVM[itemName] = item;

			/**
    * 这里创建订阅者的时候要加入当前匹配前缀
    */
			var sparam = {
				exprMatch: itemName,
				prefix: expr + "[" + i + "]"
			};

			Object.defineProperty(sparam, "prefix", {
				get: function get() {
					return expr + "[" + arr.indexOf(item) + "]";
				}
			});

			var bufferFragment = getBufferFragment();
			traverseDom(childs, function (child) {
				bufferFragment.appendChild(child);
			}, true);

			helix.compileDom(bufferFragment, tmpVM, tmpOwner, sparam);
			childFragments.splice(i, 0, bufferFragment);
			childVMs.splice(i, 0, tmpVM);
		};
		/**
   * 创建临时VM列表
   */
		for (var i = 0, len = arr.length; i < len; i++) {
			createTmpFragment(i);
		}
		return {
			$apply: function $apply(event) {
				if (event) {
					var param = event.param;
					if (event.type === "remove") {
						var idx = event.param.index;
						var currentChilds = dom.childNodes;
						var len = currentChilds.length;
						var i = 0,
						    k = -1;
						while (i < len) {
							var _child = currentChilds[i];
							if (_child.nodeType == 8 && _child.data == "$$$itemflag$$$") {
								k++;
							}
							if (k == idx) {
								dom.removeChild(_child);
								len--;
							} else if (k > idx) {
								break;
							} else {
								i++;
							}
						}
						//删除childVMs和childFragments
						childVMs.splice(idx, 1);
						childFragments.splice(idx, 1);
					} else if (event.type === "insert") {
						var idx = event.param.index;
						var currentChilds = dom.childNodes;
						var len = currentChilds.length;
						var i = 0,
						    k = -1;
						var tmpChild = null;
						while (i < len) {
							var _child = currentChilds[i];
							if (_child.nodeType == 8 && _child.data == "$$$itemflag$$$") {
								k++;
								tmpChild = _child;
							}
							if (k == idx) {
								break;
							} else {
								i++;
							}
						}
						var bf = this.createItemsFragement(param);
						if (k < idx) {
							dom.appendChild(bf);
						} else {
							dom.insertBefore(bf, tmpChild);
						}
					} else if (event.type === "push") {
						var bf = this.createItemsFragement(param);
						dom.appendChild(bf);
					} else if (event.type === "refresh") {
						dom.innerHTML = "";
						items = fn.call(window, owner);
						arr = items;
						//清理这childVMs,childFragments
						childVMs.length = 0;
						childFragments.length = 0;

						var bf = getBufferFragment();
						for (var i = 0, len = arr.length; i < len; i++) {
							createTmpFragment(i);
							bf.appendChild(childFragments[i]);
						}
						dom.appendChild(bf);
					}
				} else {
					/**
      * 初始化,全部加载出来.使用Fragment加速显示
      */
					var bf = getBufferFragment();
					for (var i = 0, len = childFragments.length; i < len; i++) {
						bf.appendChild(childFragments[i]);
					}
					dom.appendChild(bf);
				}
			},
			getFn: function getFn() {
				return fn;
			},
			getExpr: function getExpr() {
				/**
     * 存在临时vm
     * */
				if (param && param.exprMatch == expr.match(/[a-z0-9A-Z_]*/g)[0]) return expr.replace(param.exprMatch, param.prefix);
				return expr;
			}, createItemsFragement: function createItemsFragement(param) {
				var bf = getBufferFragment();
				for (var i = 0, len = param.element.length; i < len; i++) {
					var k = i + param.oriLen;
					createTmpFragment(k);
					bf.appendChild(childFragments[k]);
				}
				return bf;
			}
		};
	}
});