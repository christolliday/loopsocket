'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var userSessions = require('../../app/controllers/user-sessions.server.controller');

	// User sessions Routes
	app.route('/user-sessions')
		.get(userSessions.list)
		.post(users.requiresLogin, userSessions.create);

	app.route('/user-sessions/:userSessionId')
		.get(userSessions.read)
		.put(users.requiresLogin, userSessions.hasAuthorization, userSessions.update)
		.delete(users.requiresLogin, userSessions.hasAuthorization, userSessions.delete);

	// Finish by binding the User session middleware
	app.param('userSessionId', userSessions.userSessionByID);
};
