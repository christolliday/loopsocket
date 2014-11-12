'use strict';

//Setting up route
angular.module('loops').config(['$stateProvider',
	function($stateProvider) {
		// Loops state routing
		$stateProvider.
		state('listLoops', {
			url: '/loops',
			templateUrl: 'modules/loops/views/list-loops.client.view.html'
		}).
		state('createLoop', {
			url: '/loops/create',
			templateUrl: 'modules/loops/views/create-loop.client.view.html'
		}).
		state('viewLoop', {
			url: '/loops/:loopId',
			templateUrl: 'modules/loops/views/view-loop.client.view.html'
		}).
		state('editLoop', {
			url: '/loops/:loopId/edit',
			templateUrl: 'modules/loops/views/edit-loop.client.view.html'
		});
	}
]);