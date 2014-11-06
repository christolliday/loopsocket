'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Session = mongoose.model('Session'),
	_ = require('lodash');

/**
 * Create a Session
 */
exports.create = function(req, res) {
	var session = new Session(req.body);
	session.user = req.user;

	session.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(session);
		}
	});
};

/**
 * Show the current Session
 */
exports.read = function(req, res) {
	res.jsonp(req.session);
};

/**
 * Update a Session
 */
exports.update = function(req, res) {
	var session = req.session ;

	session = _.extend(session , req.body);

	session.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(session);
		}
	});
};

/**
 * Delete an Session
 */
exports.delete = function(req, res) {
	var session = req.session ;

	session.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(session);
		}
	});
};

/**
 * List of Sessions
 */
exports.list = function(req, res) { Session.find().sort('-created').populate('user', 'displayName').exec(function(err, sessions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sessions);
		}
	});
};

/**
 * Session middleware
 */
exports.sessionByID = function(req, res, next, id) { Session.findById(id).populate('user', 'displayName').exec(function(err, session) {
		if (err) return next(err);
		if (! session) return next(new Error('Failed to load Session ' + id));
		req.session = session ;
		next();
	});
};

/**
 * Session authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.session.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};