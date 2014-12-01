'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var loops = require('../../app/controllers/loops');
	var express = require('express');

	var router = express.Router();

	// Loops Routes
	router.route('/loops')
		.get(users.requiresLogin)
		.get(loops.list)
		.post(users.requiresLogin, loops.create);

	router.route('/loops/:loopId')
		.get(users.requiresLogin)
		.get(loops.hasAuthorization)
		.get(loops.read)
		.put(users.requiresLogin, loops.hasAuthorization, loops.update)
		.delete(users.requiresLogin, loops.hasAuthorization, loops.delete);

	// Finish by binding the Loop middleware
	router.param('loopId', loops.loopByID);

	return router;
};