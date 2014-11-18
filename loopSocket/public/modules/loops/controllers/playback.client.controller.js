'use strict';



// Sessions controller
angular.module('loops').controller('PlaybackController', ['$scope', '$document',
	function($scope, $document) {

		var audioBuffer = null;
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		var context = new AudioContext();

		function loadAudio(url) {
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';

			// Decode asynchronously
			request.onload = function() {
				context.decodeAudioData(request.response, function(buffer) {
					audioBuffer = buffer;
				}, function(error) {console.log(error);}
				);
			}
			request.send();
		}
		var context = new AudioContext();

		function playSound(buffer) {
			var source = context.createBufferSource(); // creates a sound source
			source.buffer = audioBuffer; // tell the source which sound to play
			source.connect(context.destination); // connect the source to the context's destination (the speakers)
			source.start(0); // play the source now
		}
		loadAudio('samples/play/hi-hat-closed.wav');


		$scope.time = 0;
		$scope.hi_hat = [];
		$scope.playing = false;
		//var audio = new Audio('samples/play/hi-hat-closed.wav');
		var timeout;

		// Create new Session
		$scope.play = function() {
			if (!$scope.playing) {
				console.log("play");

				playback();
				timeout = setTimeout(update_clock, 500);
			} else {
				clearTimeout(timeout);
			}
		};

		function time_tick() {
			$scope.time = (($scope.time + 1) % 8);
		}

		function playback() {
			if ($scope.hi_hat[$scope.time]) {
				//audio.play();
				playSound(audioBuffer);
			}
		}

		function update_clock() {

			time_tick();
			playback();
			$scope.$apply();
			if ($scope.playing) {
				timeout = setTimeout(update_clock, 500);
			}
		};
		$scope.sample_click = function(index) {
			$scope.hi_hat[index] = !$scope.hi_hat[index];
		};
		$scope.at_time = function(i) {
			return $scope.time == (i - 1);
		}
	}
]);

angular.module('loops').filter('range', function() {
	return function(input, min, max) {
		min = parseInt(min);
		max = parseInt(max);
		for (var i = min; i <= max; i++)
			input.push(i);
		return input;
	};
});