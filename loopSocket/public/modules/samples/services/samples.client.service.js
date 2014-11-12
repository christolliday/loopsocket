'use strict';

//Samples service used to communicate Samples REST endpoints
angular.module('samples').factory('Samples', ['$resource',
	function($resource) {
		return $resource('samples/:sampleId', { sampleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);