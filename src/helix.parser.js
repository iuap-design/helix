var getterCache = {};
var setterCache = {};

function createGetterExpr( expr) {
	if (!getterCache.hasOwnProperty(expr)) {
		var funBody = "var $$$rsl = $$$obj." + expr + ";return $$$rsl;"
		var fun = new Function("$$$obj", funBody);
		getterCache[expr] = fun;
	}
	return getterCache[expr];
}

function createSetterExpr( expr) {
	if (!setterCache.hasOwnProperty(expr)) {
		var funBody = "$$$obj." + expr + "=$$$val;return;"
		var fun = new Function("$$$obj", "$$$val", funBody);
		setterCache[expr] = fun;
	}
	return setterCache[expr];
}

function doGet(expr, owner){
	
}
