/*jslint laxcomma:true, expr:true*/
(function () {

  var express = require('express')
    , flash = require('connect-flash')
    , cors = require('./CORS')
    , passport = require('passport')
    , log4js = require('log4js')
    , app = express()
    , cluster = require('cluster')
    , numCPUs = require('os').cpus().length
    , ejs = require('ejs')
    , _ = require('underscore')._;

  var WebServer = function (configs) {
    var self = this;
    var settings = {
      port: 3000,
      cookieSecret: 'dummy-secret',
      resourceFolder: 'public'
    };

    this.settings = _.extend(settings, this.parseConfigs(configs) || {});
    this.app = app;

    settings.log4js = settings.log4js || {};

    // For testing purpose
    if (!settings._disableLogging) {
      //Setup log4js
      log4js.configure(_.extend({
        appenders: [
          {
            type: "file",
            absolute: true,
            filename: '/tmp/cews.log',
            maxLogSize: 20480,
            backups: 10
          },
          {
            type: "console"
          }
        ],
        replaceConsole: true
      }, settings.log4js));
      this.logger = log4js.getLogger('CEWS');
      this.logger.info(settings);
    } else {
      this.logger = function () {
        console.log(arguments);
      };
    }



    app.configure(function () {

      // Use log4js instead
      app.use(log4js.connectLogger(self.logger, { level: settings.log4js.level || 'INFO' }));

      app.use(express.responseTime());

      if (self.settings.template)
        app.set('view engine', 'ejs');

      // Allow CORS
      app.use(cors(settings));

      // Gzip compression
      app.use(express.compress());

      // Simulate DELETE and PUT
      app.use(express.methodOverride());

      // Parse request body into nice JSON objects
      app.use(express.bodyParser());

      // Parse cookie based on cookieSecret
      app.use(express.cookieParser(settings.cookieSecret));

      // Parse session based on cookieSecret
      app.use(express.session({ secret: settings.cookieSecret }));

      // CSRF protection
      settings.csrf && app.use(express.csrf());

      // Passport stuff
      app.use(flash());
      app.use(passport.initialize());
      app.use(passport.session());
    });
  };

  WebServer.prototype = {
    parseConfigs: function (configs) {
      // JSON object
      if (_.isObject(configs)) return configs;
      // File path
      if (_.isString(configs)) {
        var fs = require('fs');
        try {
          return JSON.parse(fs.readFileSync(configs));
        } catch (e) {
          this.logger.warn('Cannot read config file, falling back to default values');
          this.logger.warn(e);
        }
      }
      return {};
    },
    models: {},
    controllers: {},
    start: function () {
      var self = this;
      if (this.settings.cluster && cluster.isMaster) {
        // Fork workers.
        for (var i = 0; i < numCPUs; i++) {
          cluster.fork();
        }
        return cluster
          .on('exit', function(worker) {
            self.logger.info('worker ' + worker.process.pid + ' died, restarting it');
            cluster.fork();
          })
          .on('fork', function (worker) {
            self.logger.info("worker: %s", worker.process.pid);
          });
      }

      this.app.listen(this.settings.port);
    },
    route: function (routes) {
      // Use router 1st before static since static does a hard disk check.
      // Otherwise, do something like `app.get('/static', express.static...)`
      app.use(app.router);

      // Serve static from resource folder
      app.use(express.static(settings.resourceFolder, {maxAge: 31557600000}));

      var self = this;
      _.each(routes, function (routes, method) {
        _.each(routes, function (controllerFn, route) {
          return self.app[method](route, controllerFn);
        });
      });
    }
  };

  module.exports = WebServer;

})();