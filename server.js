/*jslint laxcomma:true, expr:true*/
var server = require('./index')
	, webServer = new server.WebServer({
		port: 8080
	});

webServer.controllers = {
	get: {
		'/': function (req, res) {
			res.json({ test:'It works'});
		}
	}
};

webServer.start();