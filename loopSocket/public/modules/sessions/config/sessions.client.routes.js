'use strict';

//Setting up route
angular.module('sessions').config(['$stateProvider',
	function($stateProvider) {
		// Sessions state routing
		$stateProvider.
		state('listSessions', {
			url: '/sessions',
			templateUrl: 'modules/sessions/views/list-sessions.client.view.html'
		}).
		state('createSession', {
			url: '/sessions/create',
			templateUrl: 'modules/sessions/views/create-session.client.view.html'
		}).
		state('viewSession', {
			url: '/sessions/:sessionId',
			templateUrl: 'modules/sessions/views/edit-session.client.view.html'
		});
	}
]);