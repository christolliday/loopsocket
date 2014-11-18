'use strict';



// Sessions controller
angular.module('loops').controller('PlaybackController', ['$scope', '$document',
	function($scope,$document) {



		$scope.time = 0;
		var audio = new Audio('samples/play/hi-hat-closed.wav');
		var timeout;

		// Create new Session
		$scope.play = function() {
			if(!$scope.playing) {
				console.log("play");

				playback();
				timeout = setTimeout(update_clock, 500);
			} else {
				clearTimeout(timeout);
			}
		};
		function time_tick() {
			$scope.time = (($scope.time+1)%8);
		}
		function playback() {
			if($scope.hi_hat[$scope.time]) {
				audio.play();
			}
		}
		function update_clock() {

			time_tick();
			playback();
			$scope.$apply();
			if($scope.playing) {
				timeout = setTimeout(update_clock, 500);
			}
		};
		$scope.sample_click = function(index) {
			$scope.hi_hat[index] = true;
		};
		function enable_beat() {

		};

		$scope.hi_hat = [];
		$scope.playing = false;

		$scope.at_time = function(i) {
			return $scope.time==(i-1);
		}
	}
]);

angular.module('loops').filter('range', function() {
  return function(input, min, max) {
    min = parseInt(min);
    max = parseInt(max);
    for (var i=min; i<=max; i++)
      input.push(i);
    return input;
  };
});
