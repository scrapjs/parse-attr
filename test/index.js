var parse = require('../index');
var assert = require('chai').assert;

describe('Parsing', function(){
	it('value', function(){
		parse.value('123');
		parse.value('true');
	})
	it('attribute', function(){
		parse.attribute({})
	})
	it('object', function(){
		parse.object('{1:1}');
	})
	it('list', function(){
		parse.list('1,2,4');
	})
	it('stringify', function(){
		parse.stringify({a:1});
		parse.stringify([1,2,43]);
	})
})