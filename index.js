var type = require('mutypes');
var str = require('mustring');
var eachCSV = require('each-csv');

var has = type['has'];
var isArray = type['isArray'];
var isString = type['isString'];
var isElement = type['isElement'];
var isObject = type['isObject'];
var dashed = str['dashed'];

var parse = module.exports = {
	//parse attribute from the target
	attribute: function(target, name, example){
		var result;

		//parse attr value
		if (!has(target, name)) {
			if (has(target, 'attributes')) {
				var dashedPropName = str.dashed(name);

				var attr = target.attributes[name] || target.attributes['data-' + name] || target.attributes[dashedPropName] || target.attributes['data-' + dashedPropName];

				if (attr) {
					// console.log('parseAttr', name, propType)
					//fn on-attribute
					if (/^on/.test(name)) {
						target[name] = new Function(attr.value);
					}

					//detect based on type
					else {
						target[name] = parse.typed(attr.value, getType(example));
					}
				}
			}
		}

		return result;
	},

	//returns value from string with correct type except for array
	//TODO: write tests for this fn
	value: function(str){
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
				return JSON.parse(str)
			} catch (e) {
				return str
			}
		}
		return str;
	},

	//parse value according to the type passed
	typed: function(value, type){
		var res;
		// console.log('parse typed', value, type)
		if (isArray(type)) {
			res = parse.list(value);
		} else if (isNumber(type)) {
			res = parseFloat(value)
		} else if (isBool(type)){
			res = !/^(false|off|0)$/.test(value);
		} else if (isFn(type)){
			res = new Function(value);
		} else if (isString(type)){
			res = value;
		} else if (isObject(type)) {
			res = parse.object(value)
		} else {
			if (isString(value) && !value.length) res = true;
			else res = parse.value(value);
		}

		return res;
	},

	object: function(str){
		if (str[0] !== '{') str = '{' + str + '}';
		try {
			return JSON.parse(str);
		} catch (e) {
			return {}
		}
	},

	//returns array parsed from string
	list: function(str){
		if (!isString(str)) return [parse.value(str)]

		//clean str from spaces/array rudiments
		str = str.trim();
		if (str[0] === '[') str = str.slice(1);
		if (str.length > 1 && str[str.length - 1] === ']') str = str.slice(0,-1);

		var result = [];
		eachCSV(str, function(value) {
			result.push(parse.value(value))
		})

		return result;
	},

	//stringify any element passed, useful for attribute setting
	stringify: function(el){
		if (!el) {
			return '' + el
		} if (isArray(el)){
			//return comma-separated array
			return el.join(',')
		} else if (isElement(el)){
			//return id/name/proper selector
			return el.id

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
};