'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var sessions = require('../../app/controllers/sessions');

	// Sessions Routes
	app.route('/sessions')
		.get(sessions.list)
		.post(users.requiresLogin, sessions.create);

	app.route('/sessions/:sessionId')
		.get(sessions.read)
		.put(users.requiresLogin, sessions.hasAuthorization, sessions.update)
		.delete(users.requiresLogin, sessions.hasAuthorization, sessions.delete);

	// Finish by binding the Session middleware
	app.param('sessionId', sessions.sessionByID);
};