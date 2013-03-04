/*jslint laxcomma:true*/
var server = require('./index')
	, webServer = new server.WebServer();

webServer.start();