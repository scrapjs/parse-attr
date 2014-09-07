var type = require('mutypes');
var str = require('mustring');
var eachCSV = require('each-csv');

var has = type.has;
var isArray = type.isArray;
var isString = type.isString;
var isFn = type.isFn;
var isElement = type.isElement;
var isNumber = type.isNumber;
var isObject = type.isObject;
var isBool = type.isBool;
var dashed = str.dashed;

module.exports = {
	value: parseValue,
	attribute: parseAttr,
	typed: parseTyped,
	object: parseObject,
	list: parseList,
	stringify: stringify
};

//parse attribute from the target
function parseAttr(target, name, example){
	var result;

	//parse attr value
	if (!has(target, name)) {
		if (has(target, 'attributes')) {
			var dashedPropName = str.dashed(name);

			var attrs = target.attributes,
				attr = attrs[name] || attrs['data-' + name] || attrs[dashedPropName] || attrs['data-' + dashedPropName];

			if (attr) {
				var attrVal = attr.value;
				// console.log('parseAttr', name, propType)
				//fn on-attribute
				// if (/^on/.test(name)) {
				// 	target[name] = new Function(attrVal);
				// }

				//detect based on type
				// else {
					target[name] = parseTyped(attrVal, example);
				// }
			}
		}
	}

	return result;
}

//returns value from string with correct type except for array
//TODO: write tests for this fn
function parseValue(str){
	var v;
	// console.log('parse', str)
	if (/true/i.test(str)) {
		return true;
	} else if (/false/i.test(str)) {
		return false;
	} else if (!/[^\d\.\-]/.test(str) && !isNaN(v = parseFloat(str))) {
		return v;
	} else if (/\{/.test(str)){
		try {
			return JSON.parse(str);
		} catch (e) {
			return str;
		}
	}
	return str;
}

//parse value according to the type passed
function parseTyped(value, type){
	var res;
	// console.log('parse typed', value, type)
	if (isArray(type)) {
		res = parseList(value);
	} else if (isNumber(type)) {
		res = parseFloat(value);
	} else if (isBool(type)){
		res = !/^(false|off|0)$/.test(value);
	} else if (isFn(type)){
		res = value; //new Function(value);
	} else if (isString(type)){
		res = value;
	} else if (isObject(type)) {
		res = parseObject(value);
	} else {
		if (isString(value) && !value.length) res = true;
		else res = parseValue(value);
	}

	return res;
}

function parseObject(str){
	if (str[0] !== '{') str = '{' + str + '}';
	try {
		return JSON.parse(str);
	} catch (e) {
		return {};
	}
}

//returns array parsed from string
function parseList(str){
	if (!isString(str)) return [parseValue(str)];

	//clean str from spaces/array rudiments
	str = str.trim();
	if (str[0] === '[') str = str.slice(1);
	if (str.length > 1 && str[str.length - 1] === ']') str = str.slice(0,-1);

	var result = [];
	eachCSV(str, function(value) {
		result.push(parseValue(value));
	});

	return result;
}

//stringify any element passed, useful for attribute setting
function stringify(el){
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
}