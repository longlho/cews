/*jslint laxcomma:true*/
(function () {

  var express = require('express')
    , flash = require('connect-flash')
    , passport = require('passport')
    , app = express()
    , cluster = require('cluster')
    , numCPUs = require('os').cpus().length
    , Router = require('./Router')
    , ejs = require('ejs')
    , _ = require('underscore')._;

  var WebServer = function (configs) {
    var self = this;

    var settings = {
      port: 3000,
      cookieSecret: 'dummy-secret',
      resourceFolder: 'public'
    };

    var init = function () {
      settings = _.extend(settings, configs || {});
      app.configure(function () {
        app.set('view engine', 'ejs');
        app.use(express.compress());

        app.use(express.methodOverride());
        app.use(express.bodyParser());
        app.use(express.cookieParser(settings.cookieSecret));
        app.use(express.session({ secret: settings.cookieSecret }));
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(express.static(settings.resourceFolder));
      });
      self.settings = settings;
    };

    this.ejs = ejs;
    this.app = app;
    this.models = {};
    this.controllers = {};

    this.start = function () {
      if (cluster.isMaster) {
        // Fork workers.
        for (var i = 0; i < numCPUs; i++) {
          cluster.fork();
        }
        return cluster
          .on('exit', function(worker) {
            console.log('worker ' + worker.process.pid + ' died, restarting it');
            cluster.fork();
          })
          .on('fork', function (worker) {
            console.log("worker: %s", worker.process.pid);
          });
      }
      self.router = new Router(app, self.controllers);

      app.listen(settings.port);
    };
    init();
  };

  module.exports = WebServer;

})();