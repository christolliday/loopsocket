'use strict';

// Sessions controller
angular.module('sessions').controller('PlaybackController', ['$scope',
	function($scope) {
		// Create new Session
		$scope.play = function() {
			console.log("play");

			var audio = new Audio('samples/hi-hat-closed.wav');
			audio.play();
			for(i=1;i<=8;i++) {
				$scope.timeModel[i] = true;
			}
		};
		$scope.timeModel = {
		    1: false,
		    2: false,
		    3: false,
		    4: false,
		    5: false,
		    6: false,
		    7: false,
		    8: false
		};
		$scope.checkModel = {
		    1: false,
		    2: false,
		    3: false,
		    4: false,
		    5: false,
		    6: false,
		    7: false,
		    8: false
		};
	}
]);
