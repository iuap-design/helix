function forEach(obj, iterator, context) {
	var key, length;
	if (obj) {
		if (isFunction(obj)) {
			for (key in obj) {
				// Need to check if hasOwnProperty exists,
				// as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
				if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
					iterator.call(context, obj[key], key, obj);
				}
			}
		} else if (isArray(obj) || isArrayLike(obj)) {
			var isPrimitive = typeof obj !== 'object';
			for (key = 0, length = obj.length; key < length; key++) {
				if (isPrimitive || key in obj) {
					iterator.call(context, obj[key], key, obj);
				}
			}
		} else if (obj.forEach && obj.forEach !== forEach) {
			obj.forEach(iterator, context, obj);
		} else {
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					iterator.call(context, obj[key], key, obj);
				}
			}
		}
	}
	return obj;
}

function sortedKeys(obj) {
	return Object.keys(obj).sort();
}

function forEachSorted(obj, iterator, context) {
	var keys = sortedKeys(obj);
	for (var i = 0; i < keys.length; i++) {
		iterator.call(context, obj[keys[i]], keys[i]);
	}
	return keys;
}

function isFunction(value) {
	return typeof value === 'function';
}

function isArrayLike(obj) {
	if (obj == null || isWindow(obj)) {
		return false;
	}

	var length = obj.length;

	if (obj.nodeType === NODE_TYPE_ELEMENT && length) {
		return true;
	}

	return isString(obj) || isArray(obj) || length === 0 ||
		typeof length === 'number' && length > 0 && (length - 1) in obj;
}
var isArray = Array.isArray;

function isWindow(obj) {
	return obj && obj.window === obj;
}

var NODE_TYPE_ELEMENT = 1;
var NODE_TYPE_TEXT = 3;
var NODE_TYPE_COMMENT = 8;
var NODE_TYPE_DOCUMENT = 9;
var NODE_TYPE_DOCUMENT_FRAGMENT = 11;

function isString(value) {
	return typeof value === 'string';
}

function extend(dst) {
	var h = dst.$$hashKey;

	for (var i = 1, ii = arguments.length; i < ii; i++) {
		var obj = arguments[i];
		if (obj) {
			var keys = Object.keys(obj);
			for (var j = 0, jj = keys.length; j < jj; j++) {
				var key = keys[j];
				dst[key] = obj[key];
			}
		}
	}

	setHashKey(dst, h);
	return dst;
}

function setHashKey(obj, h) {
	if (h) {
		obj.$$hashKey = h;
	} else {
		delete obj.$$hashKey;
	}
}

function valueFn(value) {
	return function() {
		return value;
	};
}

function isDefined(value) {
		return typeof value !== 'undefined';
	}
	/*
	 *
	 * @description Converts the specified string to lowercase.
	 * @param {string} string String to be converted to lowercase.
	 * @returns {string} Lowercased string.
	 */
var lowercase = function(string) {
	return isString(string) ? string.toLowerCase() : string;
};
var toJson = function(arg) {
	return JSON.stringify(arg)
}


//生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
var createUUID = function() {
	return "hi" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
