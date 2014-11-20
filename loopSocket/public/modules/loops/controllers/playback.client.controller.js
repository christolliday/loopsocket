'use strict';



// Sessions controller
angular.module('loops').controller('PlaybackController', ['$scope', '$document',
	function($scope, $document) {

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

		$scope.instruments = {};

		$scope.playing = false;
		//var audio = new Audio('samples/play/hi-hat-closed.wav');
		var timeout;
		var index = 16;

		// Create new Session
		$scope.play = function() {
			if (!$scope.playing) {
				$scope.playing = true;
				console.log("play");
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

		}

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
		};
		$scope.sample_click = function(index,instrument) {
			if(!$scope.instruments[instrument]) {
				$scope.instruments[instrument] = [];
			}
			$scope.instruments[instrument][index] = !$scope.instruments[instrument][index];
			//$scope.hi_hat[index] = !$scope.hi_hat[index];
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

// <script type = "text/javascript" src = "/lib/jQuery-Knob-Master/js/jquery.knob.js">
// var circularSlider = $('#slider').CircularSlider({ 
//     min : 0, 
//     max: 359, 
//     value : 10,
//     labelSuffix: "°",
//     slide : function(value) {
//         ui.next().css({'background' : 'linear-gradient(' + value + 
//             'deg, white, cornsilk, white)'});
//     }
// });	
					

// $(function() {
// $( "#slider-range-min" ).slider({
// range: "min",
// value: 37,
// min: 1,
// max: 700,
// slide: function( event, ui ) {
// $( "#amount" ).val( "$" + ui.value );
// }
// });
// $( "#amount" ).val( "$" + $( "#slider-range-min" ).slider( "value" ) );
// });
