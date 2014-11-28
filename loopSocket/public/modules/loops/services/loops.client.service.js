'use strict';

//Loops service used to communicate Loops REST endpoints
angular.module('loops').factory('Loops', ['$resource',
	function($resource) {
		return $resource('loops/:loopId', { loopId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);