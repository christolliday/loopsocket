'use strict';



// Sessions controller
angular.module('loops').controller('PlaybackController', ['$scope', '$document', 'Samples',
	function($scope, $document, Samples) {

		//var socket = io.connect('http://localhost:3000');
		var socket = io();
  		socket.on('loop.read', function (data) {
    		console.log(data);
  		});

		var audioBuffer = null;
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		var context = new AudioContext();

		function loadAudio(url) {
			var request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.setRequestHeader ("Accept", "audio/wav");
			request.responseType = 'arraybuffer';

			// Decode asynchronously
			request.onload = function() {
				context.decodeAudioData(request.response, function(buffer) {
					audioBuffer = buffer;
				}, function(error) {console.log(error);}
				);
			};
			request.send();
		}

		function playSound(buffer) {
			var source = context.createBufferSource(); // creates a sound source
			source.buffer = audioBuffer; // tell the source which sound to play
			source.connect(context.destination); // connect the source to the context's destination (the speakers)
			source.start(0); // play the source now
		}
		loadAudio('samples/play/hi-hat-closed.wav');


		$scope.time = 0;
		$scope.hi_hat = [];

		$scope.instruments = {};

		$scope.playing = false;
		//var audio = new Audio('samples/play/hi-hat-closed.wav');
		var timeout;
		var index = 16;

		$scope.samples = Samples.query(function() {
			$scope.selectedSample = $scope.samples[0];
		});
		$scope.changeSample = function() {
			var url = 'samples/'+$scope.selectedSample._id;
			loadAudio(url);
		};

		// Create new Session
		$scope.play = function() {
			if (!$scope.playing) {
				$scope.playing = true;
				
				socket.emit('serverListner', 'playClicked');

				playback();
				timeout = setTimeout(update_clock, 500);
			} else {
				$scope.playing = false;
				clearTimeout(timeout);
			}
		};

		$scope.stop = function() {
			clearTimeout(timeout);
			$scope.time = 0;
			$scope.playing = false;
		};

		$scope.clear = function() {

			for (var instrument in $scope.instruments) {
				for (var index in $scope.instruments[instrument]) {
					$scope.instruments[instrument][index] = false;
				}
			}
		};


		function time_tick() {
			$scope.time = (($scope.time + 1) % index);
		}

		function playback() {
			for(var instrument_name in $scope.instruments) {
				var instrument = $scope.instruments[instrument_name];
				if (instrument[$scope.time]) {
					playSound(audioBuffer);
				}

			}
			/*if ($scope.hi_hat[$scope.time]) {
				//audio.play();
				playSound(audioBuffer);
			}*/
		}

		function update_clock() {

			time_tick();
			playback();
			$scope.$apply();
			if ($scope.playing) {
				timeout = setTimeout(update_clock, 500);
			}
		}
		$scope.sample_click = function(index,instrument) {
			if(!$scope.instruments[instrument]) {
				$scope.instruments[instrument] = [];
			}
			$scope.instruments[instrument][index] = !$scope.instruments[instrument][index];
			//$scope.hi_hat[index] = !$scope.hi_hat[index];
		};
		$scope.at_time = function(i) {
			return $scope.time == (i - 1);
		};

		$scope.pressed = function (index, instrument) {
	
			return $scope.instruments[instrument][index];
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
