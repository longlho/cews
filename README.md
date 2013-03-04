Crud Express Web Server
===

Simple wrapper for NodeJS Express that has a bunch of dependencies, ready for use.

What it includes:

- `Express`, with `gzip` compression and `session` enabled.
- `Class.js` that supports classical inheritance.
- `log4js` for logging.
- A Dispatcher that handles communication between the WebServer and a 3rd-party RESTful service.
- `ejs` as templating.
- `underscore` as utilities.

Getting started
----
Check out `sample.js` for sample and configurations.

You can get started with importing the library:

	var server = require('cews');
	
To initialize the server:

	var app = new server.WebServer();
	app.start();

Configurations are passed in the constructor:

	var configs = {
		port: 3001, //Port to start
		cookieSecret: 'dummy-secret' //Secret token to encrypt cookie,
		resourceFolder: 'public' //Should be absolute path to public static resource folder, like css and UI js stuff
	};
	var app = new server.WebServer(configs);
	app.start();
	