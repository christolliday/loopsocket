'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	UserSession = mongoose.model('UserSession'),
	_ = require('lodash');

/**
 * Create a User session
 */
exports.create = function(req, res) {
	var userSession = new UserSession(req.body);
	userSession.user = req.user;

	userSession.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userSession);
		}
	});
};

/**
 * Show the current User session
 */
exports.read = function(req, res) {
	res.jsonp(req.userSession);
};

/**
 * Update a User session
 */
exports.update = function(req, res) {
	var userSession = req.userSession ;

	userSession = _.extend(userSession , req.body);

	userSession.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userSession);
		}
	});
};

/**
 * Delete an User session
 */
exports.delete = function(req, res) {
	var userSession = req.userSession ;

	userSession.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userSession);
		}
	});
};

/**
 * List of User sessions
 */
exports.list = function(req, res) { 
	UserSession.find().sort('-created').populate('user', 'displayName').exec(function(err, userSessions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(userSessions);
		}
	});
};

/**
 * User session middleware
 */
exports.userSessionByID = function(req, res, next, id) { 
	UserSession.findById(id).populate('user', 'displayName').exec(function(err, userSession) {
		if (err) return next(err);
		if (! userSession) return next(new Error('Failed to load User session ' + id));
		req.userSession = userSession ;
		next();
	});
};

/**
 * User session authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.userSession.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
