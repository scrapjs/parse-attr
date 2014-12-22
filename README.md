# parse-attr [![Build Status](https://travis-ci.org/dfcreative/parse-attr.svg?branch=master)](https://travis-ci.org/dfcreative/parse-attr) [![Code Climate](https://codeclimate.com/github/dfcreative/parse-attr/badges/gpa.svg)](https://codeclimate.com/github/dfcreative/parse-attr) <a href="UNLICENSE"><img src="http://upload.wikimedia.org/wikipedia/commons/6/62/PD-icon.svg" width="20"/></a>

Parse / serialize attribute from element.


# API

### parseAttr(el, attrName, type)

Return attribute parsed according to the type

```js
var parseAttr = require('parse-attr');
var domify = require('domify');

var element = domify('<div data-some-value="1,2,3"></div>');

parseAttr(element, 'someValue', []) //[1, 2, 3]
```

### .stringify(value)

Convert any value to human-readable string for attribute

```js
var stringify = require('parse-attr').stringify;

stringify([1, 2, 3]); // '1,2,3'
```


[![NPM](https://nodei.co/npm/parse-attr.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/parse-attr/)