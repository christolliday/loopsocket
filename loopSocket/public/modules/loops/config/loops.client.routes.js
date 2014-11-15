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
		state('editLoop', {
			url: '/loops/:loopId',
			templateUrl: 'modules/loops/views/edit-loop-3.client.view.html'
		}).
		state('socket', {
			url: '/loops/:loopId/socket',
			templateUrl: 'modules/loops/views/socket-loop.client.view.html'
		}).
		state('editLoop2', {
			url: '/loops/:loopId',
			templateUrl: 'modules/loops/views/edit-loop-2.client.view.html'
		}).
		state('loopSettings', {
			url: '/loops/:loopId/settings',
			templateUrl: 'modules/loops/views/settings-loop.client.view.html'
		});
	}
]);