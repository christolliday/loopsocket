'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	var express = require('express');
	var router = express.Router();
	// User Routes
	var users = require('../../app/controllers/users');

	// Setting up the users profile api
	router.route('/users/me').get(users.me);
	router.route('/users').put(users.update);
	router.route('/users/accounts').delete(users.removeOAuthProvider);

	// Setting up the users password api
	router.route('/users/password').post(users.changePassword);
	router.route('/auth/forgot').post(users.forgot);
	router.route('/auth/reset/:token').get(users.validateResetToken);
	router.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	router.route('/auth/signup').post(users.signup);
	router.route('/auth/signin').post(users.signin);
	router.route('/auth/signout').get(users.signout);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);

	return router;
};
