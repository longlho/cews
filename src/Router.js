/*jslint laxcomma:true*/
(function () {

  var _ = require('underscore')._;

  //Initialize Router. Required params:
  //
  // - `expressServer`: actual `express` server object
  // - `controllers': map of controllers to routes, with structures like
  // { get: { 'profile/:id': handlerFn } }
  // - `opts`: toggling built-in support for CORS
  var Router = function (expressServer, controllers, opts) {
    var routes = controllers || {};
    opts = opts || {};
    //CORS stuff
    if (opts.cors) {
      expressServer.all('*', function (req, res, next) {
        var origin = req.get('origin') || '*';
        res.header('Access-Control-Allow-Origin', "*");
        res.header('Access-Control-Allow-Methods', "POST, GET, PUT, DELETE, OPTIONS");
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Headers', "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept");
        res.header('Content-Type', 'application/json; charset=utf8');
        if (req.method === 'OPTIONS') {
          res.header('Access-Control-Max-Age', 86400);
          return res.send(200);
        }
        next();
      });
    }

    _.each(routes, function (routes, method) {
      _.each(routes, function (controllerFn, route) {
        return expressServer[method](route, controllerFn);
      });
    });
  };

  module.exports = Router;
})();