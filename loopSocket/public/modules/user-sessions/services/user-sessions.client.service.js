'use strict';

//User sessions service used to communicate User sessions REST endpoints
angular.module('user-sessions').factory('UserSessions', ['$resource',
	function($resource) {
		return $resource('user-sessions/:userSessionId', { userSessionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);