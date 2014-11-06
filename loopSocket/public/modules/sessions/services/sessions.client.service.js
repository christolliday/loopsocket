'use strict';

//Sessions service used to communicate Sessions REST endpoints
angular.module('sessions').factory('Sessions', ['$resource',
	function($resource) {
		return $resource('sessions/:sessionId', { sessionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);