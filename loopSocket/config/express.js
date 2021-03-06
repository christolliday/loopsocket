'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
	http = require('http'),
	socketio = require('socket.io'),
	//mongoose = require('mongoose'),
	//Loop = mongoose.model('Loop'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	compress = require('compression'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	helmet = require('helmet'),
	passport = require('passport'),
	mongoStore = require('connect-mongo')({
		session: session
	}),
	flash = require('connect-flash'),
	config = require('./config'),
	consolidate = require('consolidate'),
	path = require('path');

module.exports = function(db) {
	// Initialize express app
	var app = express();

	// Globbing model files
	config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	// Setting application local variables
	app.locals.title = config.app.title;
	app.locals.description = config.app.description;
	app.locals.keywords = config.app.keywords;
	app.locals.jsFiles = config.getJavaScriptAssets();
	app.locals.cssFiles = config.getCSSAssets();
	app.locals.baseUrl = config.baseUrl;

	console.log(config.baseUrl);

	// Passing the request url to environment locals
	app.use(function(req, res, next) {
		res.locals.url = req.protocol + '://' + req.headers.host + req.url;
		next();
	});

	// Should be placed before express.static
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// Showing stack errors
	app.set('showStackError', true);

	// Set swig as the template engine
	app.engine('server.view.html', consolidate[config.templateEngine]);

	// Set views path and view engine
	app.set('view engine', 'server.view.html');
	app.set('views', './app/views');

	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {
		// Enable logger (morgan)
		app.use(morgan('dev'));

		// Disable views cache
		app.set('view cache', false);
	} else if (process.env.NODE_ENV === 'production') {
		app.locals.cache = 'memory';
	}

	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	// Enable jsonp
	app.enable('jsonp callback');

	// CookieParser should be above session
	app.use(cookieParser());

	// Express MongoDB session storage
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: new mongoStore({
			db: db.connection.db,
			collection: config.sessionCollection
		})
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// connect flash for flash messages
	app.use(flash());

	// Use helmet to secure Express headers
	app.use(helmet.xframe());
	app.use(helmet.xssFilter());
	app.use(helmet.nosniff());
	app.use(helmet.ienoopen());
	app.disable('x-powered-by');

	// Setting the app router and static folder
	app.use(express.static(path.resolve('./public')));

	// Globbing routing files
	config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
		var router = require(path.resolve(routePath))(app);
		app.use(router);
	});

	// Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
	app.use(function(err, req, res, next) {
		// If the error object doesn't exists
		if (!err) return next();

		// Log it
		console.error(err.stack);

		// Error page
		res.status(500).render('500', {
			error: err.stack
		});
	});

	// Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404).render('404', {
			url: req.originalUrl,
			error: 'Not Found'
		});
	});

	//Attaching SocketIO
	var server = http.createServer(app);
	var io = socketio.listen(server);
	var activeUsers = [];

	io.on('connection', function(socket){
		socket.on('toServer', function (data){
			//console.log(data);
			io.emit('toAllClients', data);
		});
		socket.on('toServer_initNewClient', function(sid){
			socket.broadcast.emit('toAllClients_initNewClient', sid);
		});
		socket.on('disconn', function (data) {
			//console.log("Disconnected " + data.userName + " from " + data.sid);
			var sid = data.sid;
			var userName = data.userName;
			for (var i = 0; i < activeUsers.length; i++){
				if (activeUsers[i].sid === sid && activeUsers[i].userName === userName)
					activeUsers.splice(i, 1);
			}
			//console.log(activeUsers);
			io.emit('activeUsers', activeUsers);
		});
		socket.on('conn', function (data) {
			//console.log("Connected " + data.userName + " to " + data.sid);
			var sid = data.sid;
			var userName = data.userName;
			var temp = {'sid': sid, 'userName' : userName};
			var push = 'true';
			for (var i = 0; i < activeUsers.length; i++){
				if (activeUsers[i].sid === sid && activeUsers[i].userName === userName)
					push = 'false';
			}
			if (push === 'true')
				activeUsers.push(temp); // TO-DO: DO NOT PUSH IF ALREADY THERE (MIGHT OCCUR ON REFRESH)
			//console.log(activeUsers);
			io.emit('activeUsers', activeUsers);
		});
	});

	app.set('socketio', io); // For external use
	app.set('server', server); // For external use
	return app;
};