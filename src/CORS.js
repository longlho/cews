(function () {

  //CORS middleware
  var CORS = function (settings) {
    settings = settings || {};
    settings.cors = settings.cors || {};
    return function (req, res, next) {
      res.header('Access-Control-Allow-Origin', settings.cors.domains || '*');
      res.header('Access-Control-Allow-Methods', "POST, GET, PUT, DELETE, OPTIONS");
      res.header('Access-Control-Allow-Headers', "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept");
      if (req.method === 'OPTIONS') {
        res.header('Access-Control-Max-Age', 86400);
        return res.send(200);
      }
      next();
    };
  };
  module.exports = CORS;
})();