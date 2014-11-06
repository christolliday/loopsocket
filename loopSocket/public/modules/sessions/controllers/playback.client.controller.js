'use strict';

// Sessions controller
angular.module('sessions').controller('PlaybackController', ['$scope',
	function($scope) {
		// Create new Session
		$scope.play = function() {
			console.log("play");
		}
	}
]);
