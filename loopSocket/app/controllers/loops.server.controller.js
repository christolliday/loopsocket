'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Loop = mongoose.model('Loop'),
	_ = require('lodash');

/**
 * Create a Loop
 */
exports.create = function(req, res) {
	var loop = new Loop(req.body);
	loop.user = req.user;

	loop.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(loop);
		}
	});
};

/**
 * Show the current Loop
 */
exports.read = function(req, res) {
	// SocketIO stuff
	var socketio = req.app.get('socketio');
	//socketio.on('connection', function (socket) {
		socketio.sockets.emit('loop.read', 'loop.read');
	//});
	res.jsonp(req.loop);
};

/**
 * Update a Loop
 */
exports.update = function(req, res) {
	var loop = req.loop ;

	loop = _.extend(loop , req.body);

	loop.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log("Update");
			res.jsonp(loop);
		}
	});
};

/**
 * Delete an Loop
 */
exports.delete = function(req, res) {
	var loop = req.loop ;

	loop.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(loop);
		}
	});
};

/**
 * List of Loops
 */
exports.list = function(req, res) { Loop.find().sort('-created').populate('user', 'displayName').exec(function(err, loops) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(loops);
		}
	});
};

/**
 * Loop middleware
 */
exports.loopByID = function(req, res, next, id) { 
	Loop.findById(id).populate('user', 'displayName').exec(function(err, loop) {
		if (err) return next(err);
		if (! loop) return next(new Error('Failed to load Loop ' + id));
		req.loop = loop;
		next();
	});
};

/**
 * Loop authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.loop.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};