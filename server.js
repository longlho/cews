/*jslint laxcomma:true, expr:true*/
var logger = require('log4js').getLogger('Server')
	, server = require('./index')
	, webServer = new server.WebServer({
		port: process.env.PORT || 3000,
		log4js: {
			level: 'INFO'
		},
		cors: {
			domains: 'localhost'
		}
	});

webServer.route({
	get: {
		'/': function (req, res) {
			logger.debug('test');
			setTimeout(function () {
				res.json({ test:'It works'});
			}, 1000);
		}
	}
});

webServer.start();