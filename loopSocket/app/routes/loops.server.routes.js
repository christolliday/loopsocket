'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var loops = require('../../app/controllers/loops');
	var express = require('express');

	var router = express.Router();

	// Loops Routes
	router.route('/loops')
		.get(loops.list)
		.post(users.requiresLogin, loops.create);

	router.route('/loops/:loopId')
		.get(loops.read)
		.put(users.requiresLogin, loops.hasAuthorization, loops.update)
		.delete(users.requiresLogin, loops.hasAuthorization, loops.delete);

	app.route('/members')
		.get(loops.getMember);

	// Finish by binding the Loop middleware
	router.param('loopId', loops.loopByID);

	return router;
};