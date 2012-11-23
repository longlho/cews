(function () {

  var express = require('express')
    , app = express()
    , MemoryStore = express.session.MemoryStore
    , ejs = require('ejs')
    , _ = require('underscore')._;

  var WebServer = function (configs) {
    var self = this;

    var settings = {
      port: 8080,
      cookieSecret: 'dummy-secret',
      resourceFolder: 'public'
    };

    var init = function () {
      settings = _.extend(settings, configs || {});
      app.engine('html', ejs.renderFile);
      app.use(express.compress());
      app.use(express.methodOverride());
      app.use(express.bodyParser());
      app.use(express.cookieParser(settings.cookieSecret));
      app.use(express.session({ secret: settings.cookieSecret, store: new MemoryStore({ reapInterval: 60000 * 10 }) }));
      app.use(express.methodOverride());
      app.use(express.static(settings.resourceFolder));

      self.settings = settings;
    }

    this.ejs = ejs;
    this.app = app;
    this.models = {};
    this.controllers = {};

    this.start = function () {
      app.listen(settings.port);
    };

    init();

  }

  module.exports = WebServer;

})();