'use strict';


// Sessions controller
angular.module('loops').controller('PlaybackController', ['$scope', '$document', 'Samples', '$location', 'InstrData', '$interval',
	function($scope, $document, Samples, $location, InstrData, $interval) {

		var relpath = $location.path();
		var sid = relpath.substring(7);
		//console.log(sid);

		//var socket = io.connect('http://localhost:3000'); // port# not needed?!
		var socket = io(); // jshint ignore:line

		socket.emit('toServer_initNewClient', sid);
		socket.on('toAllClients_initNewClient', function(sidFromServer) {
			if (sidFromServer === sid)
				syncState();
		});
		socket.on('toAllClients', function (data) {
			console.log(data);
			if (data.sid === sid){
				//console.log("Data for me! "+JSON.stringify(data,null,2));
				$scope.loop = data.loop;
				$scope.$apply();
			}
		});

		var sampleBuffers = {};
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		var context = new AudioContext(); // jshint ignore:line

		function loadAudio(id) {
			if(!sampleBuffers[id]) {
				var url = 'samples/'+id;
				var request = new XMLHttpRequest();
				request.open('GET', url, true);
				request.setRequestHeader ('Accept', 'audio/wav');
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

		$scope.loop = {};
		function initLoop() {
			$scope.loop.bpm = 100;
			$scope.loop.time = 0;
			$scope.loop.num_bars = 4;
			$scope.loop.beats_per_bar = 4;
			$scope.loop.playing = false;
			$scope.loop.instruments = [];
			for(var i=0;i<default_num_samples;i++) {
				$scope.loop.instruments[i] = {beats:[]};
				$scope.loop.instruments[i].sample = $scope.samples[i];
				loadAudio($scope.loop.instruments[i].sample._id);
			}
		}

		var timeout;
		var default_num_samples = 7;

		$scope.samples = Samples.query(function() {
			initLoop();
			saveState();
		});

		$scope.getInstrumentsPretty = function() {
			return JSON.stringify($scope.loop,null,2);
		};

		$scope.changeSample = function(sample,instrument) {
			instrument.sample = sample;
			loadAudio(instrument.sample._id);
			saveState();
			syncState();
		};
		$scope.playInstrument = function(instrument) {
			var sampleBuffer = sampleBuffers[instrument.sample._id];
			playSound(sampleBuffer);
		};
		$scope.addInstrument = function() {
			$scope.loop.instruments.push({sample:$scope.samples[0],beats:[]});
			saveState();
			syncState();
		};
		$scope.removeInstrument = function(instrument) {
			$scope.loop.instruments.splice( $scope.loop.instruments.indexOf(instrument), 1 );
			saveState();
			syncState();
		};
		function getBeatDuration() {
			return 60000/$scope.loop.bpm;
		}

		$scope.bpmChange = function(diff) {
			//$scope.loop.bpm += diff;
			saveState();
			syncState();
		};

		$scope.bpbChange = function()
		{
			saveState();
			syncState();
		}

		$scope.barsChange = function()
		{
			saveState();
			syncState();
		}

		$scope.play = function() {
			if (!$scope.loop.playing) {
				$scope.loop.playing = true;
				console.log('play');
				playback();
				timeout = setTimeout(update_clock, getBeatDuration());
			} else {
				$scope.loop.playing = false;
				clearTimeout(timeout);
			}
		};

		$scope.stop = function() {
			clearTimeout(timeout);
			$scope.loop.time = 0;
			$scope.loop.playing = false;
		};

		$scope.clear = function() {
			for (var instrument in $scope.loop.instruments) {
				$scope.loop.instruments[instrument].beats = [];
			}
			saveState();
			syncState();
		};
		$scope.total_beats = function() {
			return $scope.loop.num_bars*$scope.loop.beats_per_bar;
		};

		function time_tick() {
			$scope.loop.time = (($scope.loop.time + 1) % $scope.total_beats());
		}

		function playback() {
			for (var i=0;i<$scope.loop.instruments.length;i++) {
				var instrument = $scope.loop.instruments[i];
				if (instrument.beats[$scope.loop.time]) {
					$scope.playInstrument(instrument);
				}
			}
		}

		function update_clock() {

			time_tick();
			playback();
			$scope.$apply();
			if ($scope.loop.playing) {
				timeout = setTimeout(update_clock, getBeatDuration());
			}
		}
		$scope.sample_click = function(beat,instrument) {
			instrument.beats[beat] = !instrument.beats[beat];
			saveState();
			syncState();
		};
		$scope.at_time = function(i) {
			return $scope.loop.time === (i - 1);
		};

		$scope.pressed = function (beat, instrument) {
			return instrument.beats[beat];
		};

		$scope.beat_group = function(beat,group) {
			return Math.floor((beat-1)/$scope.loop.beats_per_bar)%2===(group-1);
		};

		function saveState() { //save state of loop
			var instrumentList = [];
			var beatList = [];
			for(var i=0;i<$scope.loop.instruments.length;i++) {
				var instrument = $scope.loop.instruments[i];
				instrumentList.push(instrument.sample);
				beatList.push(instrument.beats);
			}
			InstrData.addInstr(instrumentList, beatList, $scope.loop.bpm, $scope.loop.beats_per_bar, $scope.loop.num_bars);
		}

		function syncState(){	
			var state = {'sid' : sid, 'loop' : $scope.loop};
			socket.emit('toServer', state);
		}

		$scope.revertState = function() {
			var revState = InstrData.getRev();
			if(revState === null){
				alert('Nothing Saved yet.');
			} else {
				console.log(revState);

				$scope.loop.instruments = [];
				for (var i =0;i<revState.instrument.length;i++){
					$scope.loop.instruments[i] = {sample: '', beats: []};
				}
				for(var i = 0;i<revState.instrument.length;i++){ // jshint ignore:line
					$scope.loop.instruments[i].sample = revState.instrument[i];
					loadAudio($scope.loop.instruments[i].sample._id);
					$scope.loop.instruments[i].beats = revState.beats[i];
				}
				$scope.loop.bpm = revState.bpm;
				$scope.loop.beats_per_bar = revState.bpb;
				$scope.loop.num_bars = revState.numbars;
			}
		};
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
