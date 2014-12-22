/**
 * Stringify any element passed, useful for attribute setting
 *
 * @module muparse/stringify
 */

var isArray = require('mutype/is-array');
var isElement = require('mutype/is-element');
var isObject = require('mutype/is-object');
var isFn = require('mutype/is-fn');


module.exports = function stringify(el){
	if (!el) {
		return '' + el;
	} if (isArray(el)){
		//return comma-separated array
		return el.join(',');
	} else if (isElement(el)){
		//return id/name/proper selector
		return el.id;

		//that way is too heavy
		// return selector(el)
	} else if (isObject(el)){
		//serialize json
		return JSON.stringify(el);
	} else if (isFn(el)){
		//return fn body
		var src = el.toString();
		el.slice(src.indexOf('{') + 1, src.lastIndexOf('}'));
	} else {
		return el.toString();
	}
};