'use strict';

//Setting up route
angular.module('samples').config(['$stateProvider',
	function($stateProvider) {
		// Samples state routing
		$stateProvider.
		state('listSamples', {
			url: '/samples',
			templateUrl: 'modules/samples/views/list-samples.client.view.html'
		}).
		state('createSample', {
			url: '/samples/create',
			templateUrl: 'modules/samples/views/create-sample.client.view.html'
		}).
		state('viewSample', {
			url: '/samples/:sampleId',
			templateUrl: 'modules/samples/views/view-sample.client.view.html'
		}).
		state('editSample', {
			url: '/samples/:sampleId/edit',
			templateUrl: 'modules/samples/views/edit-sample.client.view.html'
		});
	}
]);