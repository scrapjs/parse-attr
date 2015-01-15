var parse = require('..');
var assert = require('chai').assert;

describe('Parsing', function(){
	it('value', function(){
		assert.equal(parse.value('123'), 123);
		assert.equal(parse.value('0'), 0);
		assert.equal(parse.value('true'), true);
		assert.equal(parse.value('false'), false);
		assert.equal(parse.value('null'), null);
		assert.equal(parse.value('undefined'), undefined);
		assert.ok(Number.isNaN(parse.value('NaN')));
		assert.equal(parse.value('Infinity'), Infinity);
		assert.deepEqual(parse.value('[]'), []);
	});
	it('attribute', function(){
		parse.attribute({});
	});
	it('object', function(){
		assert.deepEqual(parse.object('{"1":1}'), {1:1});
	});
	it('list', function(){
		assert.deepEqual(parse.list('1,2,4'), [1,2,4]);
	});
	it('stringify', function(){
		assert.equal(parse.stringify({a:1}), '{"a":1}');
		assert.equal(parse.stringify([1,2,43]), '1,2,43');
	});
})