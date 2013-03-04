/*jslint laxcomma:true*/
var http = require('http')
  , util = require('util')
  , events = require('events')
  , _ = require('underscore')._;

var Dispatcher = function () {

  events.EventEmitter.call(this);
  var self = this;

  //opts contains method, path, host, port and content if any
  //opts should have:
  // - content: content that will be serialized and sent in the body
  this.submit = function (opts, cb) {
    cb = _.isFunction(cb) ? cb : function () {};

    //Resolve RESTful stuff
    opts = opts || {};
    var content;
    if (opts.content) {
      content = JSON.stringify(opts.content);
    }
    opts = _.extend(opts, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': content ? Buffer.byteLength(content, 'utf8') : 0
      }
    });
    http.request(opts, function (res) {
      var data = '';
      res
        .on('data', function (c) { data += c; })
        .on('end', function () {
          try {
            data = JSON.parse(data);
          } catch (e) {
            return cb(e);
          }
          return cb(data.error, data.result);
        });
    })
    .on('error', cb)
    .end(content);
  };
};

util.inherits(Dispatcher, events.EventEmitter);

module.exports = new Dispatcher();