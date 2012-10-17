var log4js = require('log4js');
var LogManager = function () {
  this.configure = function (settings) {
    settings = settings || {};
    //Override logging
    log4js.configure({
      appenders: [
        {
          type: "file",
          absolute: true,
          filename: settings.logfile || '/tmp/sew.log',
          maxLogSize: 20480,
          backups: 5
        },
        {
          type: "console"
        }
      ]
    });
  };

  this.getLogger = function (filename) {
    var logger = log4js.getLogger(filename);
    logger.setLevel('INFO');
    return logger;
  }
}

module.exports = new LogManager();