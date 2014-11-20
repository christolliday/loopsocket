'use strict';



// Sessions controller
angular.module('loops').controller('PlaybackController', ['$scope', '$document', 'Samples',
	function($scope, $document, Samples) {

		//var socket = io.connect('http://localhost:3000');
		var socket = io();
  		socket.on('loop.read', function (data) {
    		console.log(data);
  		});

		var sampleBuffers = {};
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		var context = new AudioContext();

		function loadAudio(id) {
			if(!sampleBuffers[id]) {
				var url = 'samples/'+id;
				var request = new XMLHttpRequest();
				request.open('GET', url, true);
				request.setRequestHeader ("Accept", "audio/wav");
				request.responseType = 'arraybuffer';

				// Decode asynchronously
				request.onload = function() {
					context.decodeAudioData(request.response, function(buffer) {
						sampleBuffers[id] = buffer;
					}, function(error) {console.log(error);}
					);
				};
				request.send();
			}
		}

		function playSound(buffer) {
			var source = context.createBufferSource(); // creates a sound source
			source.buffer = buffer; // tell the source which sound to play
			source.connect(context.destination); // connect the source to the context's destination (the speakers)
			source.start(0); // play the source now
		}


		$scope.time = 0;
		$scope.hi_hat = [];

		$scope.instruments = [];
		for(var i=0;i<4;i++) {
			$scope.instruments[i] = {sample:"",beats:[]};
		}

		$scope.playing = false;
		var timeout;
		var index = 16;
		$scope.selectedSamples = [];
		$scope.samples = Samples.query(function() {
			$scope.selectedSamples[0] = $scope.samples[0];

			for(var i=0;i<4;i++) {
				$scope.instruments[i].sample = $scope.samples[i];//{sample:{name:$scope.samples[i].name,id:$scope.samples[i]._id}};
				loadAudio($scope.instruments[i].sample._id);
				//$scope.$apply();
			}
		});
		$scope.getInstrumentsPretty = function() {
			return JSON.stringify($scope.instruments,null,2);
		}

		$scope.changeSample = function(sample,instrument) {
			//instrument = {sample:{name:$scope.samples[i].name,id:$scope.samples[i]._id}};
			loadAudio(instrument.sample._id);
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
			for (var i=0;i<$scope.instruments.length;i++) {
				var instrument = $scope.instruments[i];
				if (instrument.beats[$scope.time]) {
					var sampleBuffer = sampleBuffers[instrument.sample._id];
					playSound(sampleBuffer);
				}
			}
			for(var instrument in $scope.instruments) {
				//var instrument = $scope.instruments[instrument_name];
				

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
		$scope.sample_click = function(beat,instrument) {

			instrument.beats[beat] = !instrument.beats[beat];
		};
		$scope.at_time = function(i) {
			return $scope.time == (i - 1);
		};

		$scope.pressed = function (index, instrument) {
			return instrument.beats[index];
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
