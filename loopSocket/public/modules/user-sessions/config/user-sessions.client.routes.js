'use strict';

//Setting up route
angular.module('user-sessions').config(['$stateProvider',
	function($stateProvider) {
		// User sessions state routing
		$stateProvider.
		state('listUserSessions', {
			url: '/user-sessions',
			templateUrl: 'modules/user-sessions/views/list-user-sessions.client.view.html'
		}).
		state('createUserSession', {
			url: '/user-sessions/create',
			templateUrl: 'modules/user-sessions/views/create-user-session.client.view.html'
		}).
		state('viewUserSession', {
			url: '/user-sessions/:userSessionId',
			templateUrl: 'modules/user-sessions/views/view-user-session.client.view.html'
		}).
		state('editUserSession', {
			url: '/user-sessions/:userSessionId/edit',
			templateUrl: 'modules/user-sessions/views/edit-user-session.client.view.html'
		});
	}
]);