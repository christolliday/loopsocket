'use strict';

// Sessions controller
angular.module('loops').controller('PlaybackController', ['$scope',
	function($scope) {

		$scope.time = 0;
		var audio = new Audio('samples/play/hi-hat-closed.wav');

		// Create new Session
		$scope.play = function() {
			console.log("play");

			audio.play();
			setTimeout(update_clock, 1000);
		};

		function update_clock() {
			//$scope.timeModel[time] = true;
			console.log($scope.time);
			if($scope.hi_hat[$scope.time]) {
				audio.play();
			}

			for(var i=0;i<8;i++) {
				$scope.time_model[i] = false;
			}
			$scope.time_model[$scope.time] = true;
			$scope.time = ($scope.time+1)%8;
			if($scope.playing) {
				setTimeout(update_clock, 1000);
			}
		};
		$scope.sample_click = function(index) {
			$scope.hi_hat[index] = true;
		};
		function enable_beat() {

		};
		$scope.beats = [];
		for(var i=0;i<8;i++) {
			$scope.beats[i] = i+1;
		}
		$scope.hi_hat = [];
		$scope.time_model = [];
		$scope.playing = false;
		$scope.hihatModel = [];
		for(var i=0;i<8;i++) {
			$scope.hihatModel[i] = false;
		}
		$scope.timeModel = [];
		for(var i=0;i<8;i++) {
			$scope.timeModel[i] = false;
		}

		$scope.toggle_play = function() {
			var playBtn = $scope.getElementById("playBtn");
			var stopBtn = $scope.getElementById("stopBtn");
			if (playBtn.style.display == 'none') {
				playBtn.style.display = '';
				stopBtn.style.display = 'none';
			}
			else {
				playBtn.style.display = 'none';
				stopBtn.style.display = '';
			}
		}
		$scope.toggle_stop = function() {
			var playBtn = $scope.getElementById("playBtn");
			var stopBtn = $scope.getElementById("stopBtn");
			if (stopBtn.style.display == 'none') {
				stopBtn.style.display = '';
				playBtn.style.display = 'none';
			}
			else {
				stopBtn.style.display = 'none';
				playBtn.style.display = '';
			}
		}
	}
]);
