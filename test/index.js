var parse = require('..');
var assert = require('chai').assert;

describe('Parsing', function(){
	it('value', function(){
		assert.equal(parse.value('123'), 123);
		assert.equal(parse.value('true'), true);
	})
	it('attribute', function(){
		parse.attribute({});
	})
	it('object', function(){
		assert.deepEqual(parse.object('{"1":1}'), {1:1});
	})
	it('list', function(){
		assert.deepEqual(parse.list('1,2,4'), [1,2,4]);
	})
	it('stringify', function(){
		assert.equal(parse.stringify({a:1}), '{"a":1}');
		assert.equal(parse.stringify([1,2,43]), '1,2,43');
	})
})