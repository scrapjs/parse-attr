/**
 * @module  parse-attr/parse
 */

module.exports = parseAttr;


var eachCSV = require('each-csv');
var has = require('mutype/has');
var isArray = require('mutype/is-array');
var isString = require('mutype/is-string');
var isFn = require('mutype/is-fn');
var isNumber = require('mutype/is-number');
var isObject = require('mutype/is-object');
var isBool = require('mutype/is-bool');
var dashed = require('mustring/dashed');


//Export additional point-parsers
parseAttr.value = parseValue;
parseAttr.attribute = parseAttr;
parseAttr.typeBased = parseTyped;
parseAttr.object = parseObject;
parseAttr.list = parseList;



//parse attribute from the target
function parseAttr(target, name, exampleValue){
	var result;

	//parse attr value
	if (has(target, 'attributes')) {
		var dashedPropName = dashed(name);

		var attrs = target.attributes,
			attr = attrs[name] || attrs['data-' + name] || attrs[dashedPropName] || attrs['data-' + dashedPropName];

		if (attr) {
			var attrVal = attr.value;
			result = parseTyped(attrVal, exampleValue);
			return result;
		}
	}
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