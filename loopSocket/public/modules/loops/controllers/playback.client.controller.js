'use strict';


// Sessions controller
angular.module('loops').controller('PlaybackController', ['$scope', '$document', 'Samples', '$location',
	function($scope, $document, Samples, $location) {

		var relpath = $location.path();
		var sid = relpath.substring(7);
		console.log(sid);
		
		//var socket = io.connect('http://localhost:3000'); // port# not needed?!
		var socket = io();
  		socket.on(String(sid), function (data) {
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

		$scope.bpm = 100;
		$scope.time = 0;
		$scope.num_bars = 4;
		$scope.beats_per_bar = 4;
		$scope.playing = false;
		var timeout;
		var default_num_samples = 7;

		$scope.instruments = [];
		for(var i=0;i<default_num_samples;i++) {
			$scope.instruments[i] = {sample:"",beats:[]};
		}
		$scope.samples = Samples.query(function() {
			for(var i=0;i<default_num_samples;i++) {
				$scope.instruments[i].sample = $scope.samples[i];
				loadAudio($scope.instruments[i].sample._id);
			}
		});
		$scope.getInstrumentsPretty = function() {
			return JSON.stringify($scope.instruments,null,2);
		}

		$scope.changeSample = function(sample,instrument) {
			instrument.sample = sample;
			loadAudio(instrument.sample._id);
		};
		$scope.playInstrument = function(instrument) {
			var sampleBuffer = sampleBuffers[instrument.sample._id];
			playSound(sampleBuffer);
		};
		$scope.addInstrument = function() {
			$scope.instruments.push({sample:$scope.samples[0],beats:[]});
		};
		$scope.removeInstrument = function(instrument) {
			$scope.instruments.splice( $scope.instruments.indexOf(instrument), 1 );
		};
		function getBeatDuration() {
			return 60000/$scope.bpm;
		}

		$scope.bpmChange = function(diff) {
			$scope.bpm += diff;
		}

		$scope.play = function() {
			if (!$scope.playing) {
				$scope.playing = true;
				console.log("play");

				socket.emit(String(sid), "PlayClicked in " + String(sid));

				playback();
				timeout = setTimeout(update_clock, getBeatDuration());
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
				$scope.instruments[instrument].beats = [];
			}
		};
		$scope.total_beats = function() {
			return $scope.num_bars*$scope.beats_per_bar;
		}

		function time_tick() {
			$scope.time = (($scope.time + 1) % $scope.total_beats());
		}

		function playback() {
			for (var i=0;i<$scope.instruments.length;i++) {
				var instrument = $scope.instruments[i];
				if (instrument.beats[$scope.time]) {
					$scope.playInstrument(instrument);
				}
			}
		}

		function update_clock() {

			time_tick();
			playback();
			$scope.$apply();
			if ($scope.playing) {
				timeout = setTimeout(update_clock, getBeatDuration());
			}
		}
		$scope.sample_click = function(beat,instrument) {
			instrument.beats[beat] = !instrument.beats[beat];
		};
		$scope.at_time = function(i) {
			return $scope.time == (i - 1);
		};

		$scope.pressed = function (beat, instrument) {
			return instrument.beats[beat];
		}

		$scope.beat_group = function(beat,group) {
			return Math.floor((beat-1)/$scope.beats_per_bar)%2===(group-1);
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
