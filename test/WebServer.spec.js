/*jslint laxcomma:true */
var WebServer = require('../index').WebServer
	, assert = require('assert')
	, _ = require('underscore');

describe('WebServer', function(){
  describe('#parseConfigs()', function(){
    it('should return empty object when given no configs', function () {
      var ws = new WebServer({ _disableLogging: true });
      assert.deepEqual(ws.parseConfigs(), {});
    });
    it('should return config object when given a file path', function () {
      var ws = new WebServer({ _disableLogging: true });
      assert.deepEqual(ws.parseConfigs(__dirname + '/conf.json'), { test: 1});
    });
    it('should return config object when given an object', function () {
      var ws = new WebServer({ _disableLogging: true });
      assert.deepEqual(ws.parseConfigs({ test: 2}), { test: 2});
    });
  });
});