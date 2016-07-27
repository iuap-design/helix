function StringBuffer() {
	this.buf = [];
	this.append = function(str) {
		this.buf.push(str);
	}

	this.toString = function() {
		return this.buf.join("");
	}
}
var getterCache = {};
var setterCache = {};

function createGetterExpr(expr) {
	debugger
	if (!getterCache.hasOwnProperty(expr)) {
		var funBody = "var $$$rsl = $$$obj." + expr + ";return $$$rsl;"
		var fun = new Function("$$$obj", funBody);
		getterCache[expr] = fun;
	}
	return getterCache[expr];
}

function createSetterExpr(expr) {
	if (!setterCache.hasOwnProperty(expr)) {
		var funBody = "$$$obj." + expr + "=$$$val;return;"
		var fun = new Function("$$$obj", "$$$val", funBody);
		setterCache[expr] = fun;
	}
	return setterCache[expr];
}

function doGet(expr, owner) {
	debugger
	return createGetterExpr(expr).call(owner, owner)
}

function doSet(expr, owner, val) {
	createSetterExpr(expr).call(owner, owner, val)
}
String.prototype.endWith = function(str) {
	if (str == null || str == "" || this.length == 0 || str.length > this.length)
		return false;
	if (this.substring(this.length - str.length) == str)
		return true;
	else
		return false;
	return true;
}
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


function callBackFun(obj, expr, owner) {
	return function(o) {
		obj.target = o;
		debugger
		obj.target.expr__ = expr
		obj.target.owner__ = owner;
	}
}
function appendExpr(expr, prop){
	debugger
	if(!expr)
		return prop;
	else
		return expr + "."+prop
}
