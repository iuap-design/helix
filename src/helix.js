/**
 * helix core
 */
(function(window, document, undefined) {
	"use strict";
	var document = window.document,
		location = window.location,
		helix_version = "0.1",
		$linkers$ = {},
		_protoPropNames = ["this", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "toLocaleString", "toString", "valueOf", "constructor"],
		helix = function() {
			helix.prototype.bootstrap.call(window);
		},
		_bufferFragment = document.createDocumentFragment();
	window.OLDIE = (window == document && document != window);
	helix.prototype = {
		/**
		 * 启动程序.
		 */
		bootstrap: function() {

		},
		/**
		 * 定义一个控制器
		 */
		def: function(id, ctrl) {

			var vm = {};
			if ($.isFunction(ctrl)) {
				ctrl.call(this, vm);
			} else if ($.isPlainObject(ctrl)) {
				vm = ctrl;
			}

			var trueVM = {};
			var dom = document.getElementById(id);
			this.compileView(dom, trueVM, vm);
			this.defObserve(vm, trueVM);
			this.applyVM(trueVM);
			this.addInputWatch(dom);
			return trueVM;
		},
		applyVM: function(vm, event) {
			var len = vm.$$subscriber.length;
			for (var i = 0; i < len; i++) {
				try {
					vm.$$subscriber[i].$apply(event);
				} catch (e) {
					console.error(e);
				}
			}
		},
		/**
		 * 注册订阅者信息
		 */
		compileView: function(dom, vm, owner) {
			//订阅者
			vm.$$subscriber = [];

			this.compileDom(dom, vm, owner);
		},
		compileDom: function(dom, vm, owner, param) {
			var childs = dom.childNodes;
			var len = childs.length;
			for (var i = 0; i < len; i++) {
				var child = childs[i];
				var attr = this.getDefAttr(child);
				//存在綁定行为
				var currentVM = vm;
				if (!$.isEmptyObject(attr)) {
					var subscriber = this.analyse(child, attr, vm, owner, param);
					if (subscriber)
						vm.$$subscriber.push(subscriber);
				}
				if (child.children && child.children.length > 0) {
					this.compileDom(child, currentVM, owner, param);
				}
			}
		},
		/**
		 * 分析Dom结构,将符合条件的元素和VM进行连接,获得订阅者
		 */
		analyse: function(child, attr, vm, owner, param) {
			var tagName = child.nodeName.toLowerCase();
			var $linker = $linkers$[tagName] ? $linkers$[tagName] : defaultLinker;
			try {
				return $linker.call(vm, vm, child, attr, owner, param);
			} catch (e) {
				if (console) {
					debugger;
					console.error(tagName + "analyse fail.");
				}
			}

		},
		/**
		 * 增加输入观察者
		 */
		addInputWatch: function(dom) {
			$(dom).on("blur", "input", function(e) {
				var target = e.target;
				if (target.getAttribute("hi-bind")) {
					alert($(target).val());
				}
			})
		},
		/**
		 * 定义observe
		 */
		defObserve: function(vm, trueVM) {
			this.defPuppetObject(trueVM, vm, trueVM);
			return trueVM;
		},
		defPuppetObject: function(puppet, owner, vm) {
			puppet.$$vm = vm;
			puppet.$$owner = owner;
			for (var eleId in owner) {
				if (eleId.charAt(0) != "$" && _protoPropNames.indexOf(eleId) == -1) {
					this.defPuppetELement(eleId, owner, vm, puppet);
				}
			}
		},
		defArrayItem: function(vm, eleId, i, puppetArr, ele) {
			var puppetObj = {};
			puppetObj.$$vm = vm;
			var item = ele[i];
			Object.defineProperty(puppetObj, "$$prefix", {
				get: function() {
					var _idx = ele.indexOf(item)
					return eleId + "[" + _idx + "]"
				}
			})
			Array.prototype.splice.call(puppetArr, i, 0, puppetObj);
			this.defPuppetObject(puppetObj, ele[i], vm);
			return puppetObj;
		},
		defArrayItems: function(vm, eleId, ele, puppetArr) {
			for (var i = 0, len = ele.length; i < len; i++) {
				this.defArrayItem(vm, eleId, i, puppetArr, ele);
			}
		},
		defPuppetELement: function(eleId, owner, vm, puppet) {
			var ele = owner[eleId];
			if ($.isArray(ele)) {
				var expr = puppet.$$prefix ? puppet.$$prefix + "." + eleId : eleId;
				var puppetArr = new HArray(ele, vm, expr, puppet);
				
				var obz = {
					get: function() {
						return puppetArr;
					},
					set: function(newEle) {
						var tmpArr = puppetArr;
						puppetArr = new HArray(newEle, vm, expr);
						$helix.defArrayItems(vm, expr, newEle, puppetArr);
						owner[eleId] = newEle;
						$helix.onPropertyChange(this, eleId, puppetArr, tmpArr, {
							strictExpr: true,
							type: "refresh"
						});
						$helix.applyVM(vm, {});

					}
				};
				Object.defineProperty(puppet, eleId, obz)
				this.defArrayItems(vm,expr,  ele, puppetArr);

			} else if ($.isPlainObject(ele)) {
				var puppetObj = {};
				puppetObj.$$vm = vm;
				puppetObj.$$prefix = puppet.$$prefix ? puppet.$$prefix + "." + eleId : eleId;
				var obz = {
					get: function() {
						return puppetObj;
					},
					set: function(newEle) {
						var tmpPuppetObj = puppetObj;
						puppetObj = {};
						puppetObj.$$vm = vm;
						puppetObj.$$prefix = puppet.$$prefix ? puppet.$$prefix + "." + eleId : eleId;
						owner[eleId] = newEle;
						$helix.defPuppetObject(puppetObj, newEle, vm);
						$helix.onPropertyChange(this, eleId, puppetObj, tmpPuppetObj, {
							strictExpr: false,
							type: "refresh"
						});
						$helix.applyVM(vm, {});

					}
				};
				Object.defineProperty(puppet, eleId, obz)
				this.defPuppetObject(puppetObj, ele, vm);
			} else if (!$.isFunction(ele)) {
				this.defPuppetProperty(puppet, eleId);
			}
		},
		defPuppetProperty: function(puppet, eleId) {
			var obz = {
				eleId: eleId,
				get: function() {
					return this.$$owner[eleId];
				},
				set: function(val) {
					var oldVal = this.$$owner[eleId];
					if (oldVal != val) {
						var that = this;
						that.$$owner[eleId] = val;
						$helix.onPropertyChange(that, eleId, val, oldVal);
					}
				}
			}
			Object.defineProperty(puppet, eleId, obz)
		},
		onPropertyChange: function(that, eleId, val, oldVal, e) {
			var expr = that.$$prefix ? that.$$prefix + "." + eleId : eleId;
			var event;
			if (!e)
				event = {};
			else
				event = e;
			event.eleId = eleId;
			event.val = val;
			event.oldVal = oldVal;

			$helix.publishPropertyChanged(that.$$vm, expr, event);
		},
		publishPropertyChanged: function(vm, expr, event) {
			var subscr = vm.$$subscriber;
			var len = subscr.length;
			var strictExpr = event.strictExpr ? true : false;
			for (var i = 0; i < len; i++) {
				var subscrExpr = subscr[i].getExpr();
				var rat = strictExpr ? (subscrExpr === expr) : (subscrExpr.indexOf(expr) != -1);
				if (rat) {
					subscr[i].$apply(event);
				}
			}
		},
		defComponent: function(ids, component) {
			var $linker = function namedLinker(trueVM, dom, attr, vm) {
				return component.linker(trueVM, dom, attr, vm);
			}
			if ($.isArray(ids)) {
				$.each(ids, function(i, id) {
					$linkers$[id] = $linker;
				});
			} else {
				$linkers$[ids] = $linker;
			}
		},
		getDefAttr: function(domEle) {
			var attrMap = {};
			var nm = domEle.attributes;
			if (nm) {
				var len = nm.length;
				for (var i = 0; i < len; i++) {
					var node = nm.item(i);
					if (node.name.substring(0, 3) == ("hi-")) {
						attrMap[node.name.substring(3)] = node.value;
					}
				}
			}
			return attrMap;
		},
		util: {
			getExprFn: function(expr) {
				return createGetterExpr(expr);
			},
			removeSubScriber: function(vm, expr) {
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
			}
		}
	}

	window.getBufferFragment = function() {
		return _bufferFragment.cloneNode(true);
	}

	var $helix = new helix();
	window.helix = window.hi = $helix;

	if (window.OLDIE) {
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function(item, index) {
				var n = this.length,
					i = ~~index
				if (i < 0)
					i += n
				for (; i < n; i++)
					if (this[i] === item)
						return i
				return -1
			}
		}
	}

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
		this.notify = function(event) {
			$helix.publishPropertyChanged(this.$$vm, this.$$expr, event);
		}
		this.pop = function() {
			var lastObj =  this.$$model[this.$$model.length -1];
			this.splice(this.$$model.length -1, 1)
			return lastObj;
		}
		this.push = function() {
			var oriLen = this.$$model.length;
			var newLen = this._push.apply(this.$$model, arguments);
			var that = this;
			$.each(arguments, function(i, ele) {
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
		}
		this.reverse = function() {
			this.$$model.reverse();
			var setter = createSetterExpr(this.$$expr);
			setter.call(this.$$vm, this.$$vm, this.$$model)
		}
		this.shift = function() {
			var lastObj =  this.$$model[this.$$model.length -1];
			this.splice(0, 1)
			return lastObj;
		}
		this.unshift = function(obj) {
			this.splice(0, 0, obj)
		}
		this.removeAll = function() {
			this.splice(0, this.$$model.length)
		}
		this.addAll = function() {
			this.splice(0, 0, obj)
		}
		this.item = function(i, obj) {
			if (obj) {
				this.splice(i, 1, obj)
			}
			return this[i];
		}
		this.size = function(len) {
			if (len && !isNaN(len)) {
				this.splice(len, this.$$model.length - len)
			}
			return this.$$model.length;
		}
		this.splice = function() {
			var index = arguments[0];
			var howmany = arguments[1];
			if (howmany == undefined)
				return;
			var items = Array.prototype.slice.call(arguments, 2);
			if (howmany > 0) {
				/**--remove--**/
				Array.prototype.splice.call(this, index, howmany)
				Array.prototype.splice.call(this.$$model, index, howmany)
				var setter = createSetterExpr(this.$$expr);
				setter.call(this.$$vm, this.$$vm.$$owner, this.$$model)
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
				Array.prototype.splice.apply(that.$$model, arguments)
				var setter = createSetterExpr(this.$$expr);
				setter.call(this.$$vm, this.$$vm.$$owner, this.$$model)

				$.each(items, function(i, ele) {
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
		}
	}


})(window, document, undefined)

/**
 * 遍历对Dom进行操作
 */
function traverseDom(array, callback, deepClone) {
	for (var i = 0; i < array.length; i++) {
		var li = array[i];
		/**
		 * TextNode在IE中不可重复使用.
		 * 并且IE中如果textNode的宗主被清空内容之后,textNode会随着被清空,
		 * 所以这里重新创建一份
		 */
		if (li.nodeType == 3) {
			var tc = li.textContent;
			var $$list_idx = li.$$list_idx;
			li = document.createTextNode(tc)
			if ($$list_idx)
				li.$$list_idx = $$list_idx;
			li.textContent = tc;
		} else {
			if (deepClone)
				li = li.cloneNode(true);
		}
		callback.call(window, li);
	}
}

/**
 * 默认连接器
 * @param {Object} vm
 * @param {Object} dom
 * @param {Object} attr
 * @param {Object} owner
 */
function defaultLinker(vm, dom, attr, owner, sparam) {
	var expr = attr.data ? attr.data : attr.bind;
	var fn = helix.util.getExprFn(expr);
	var param = sparam;
	var tagName = dom.tagName.toLowerCase();
	var trueExpr = expr;
	var dynExpr = false;
	if (param && param.exprMatch == expr.match(/[a-z0-9A-Z_]*/g)[0])
		dynExpr = true;

	dom.setAttribute("expr", trueExpr);

	return {
		$apply: function() {
			var val = fn.call(window, vm);
			if (tagName == "input") {
				dom.value = val;
			} else {
				dom.innerHTML = val;
			}
		},
		getFn: function() {
			return fn;
		},
		getExpr: function() {
			if (dynExpr)
				trueExpr = expr.replace(param.exprMatch, param.prefix);
			return trueExpr;
		}
	}

}