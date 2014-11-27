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
			if (data.sid == sid){
				console.log("Data for me!");
				//JSON.stringify(data,null,2));
				$scope.loop_state = data.loop;
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
		$scope.loop_state = {};
		$scope.loop.loop_state = $scope.loop_state;

		function initLoop() {
			$scope.loop_state.bpm = 100;
			$scope.loop_state.time = 0;
			$scope.loop_state.num_bars = 4;
			$scope.loop_state.beats_per_bar = 4;
			$scope.loop_state.playing = false;
			$scope.loop_state.instruments = [];
			for(var i=0;i<default_num_samples;i++) {
				$scope.loop_state.instruments[i] = {beats:[]};
				$scope.loop_state.instruments[i].sample = $scope.samples[i];
				loadAudio($scope.loop_state.instruments[i].sample._id);
			}
		}

		var timeout;
		var default_num_samples = 7;

		$scope.samples = Samples.query(function() {
			initLoop();
		});

		$scope.getInstrumentsPretty = function() {
			return JSON.stringify($scope.loop_state,null,2);
		};

		$scope.changeSample = function(sample,instrument) {
			instrument.sample = sample;
			loadAudio(instrument.sample._id);
			stateChanged();
		};
		$scope.playInstrument = function(instrument) {
			var sampleBuffer = sampleBuffers[instrument.sample._id];
			playSound(sampleBuffer);
		};
		$scope.addInstrument = function() {
			$scope.loop_state.instruments.push({sample:$scope.samples[0],beats:[]});
			stateChanged();
		};
		$scope.removeInstrument = function(instrument) {
			$scope.loop_state.instruments.splice( $scope.loop_state.instruments.indexOf(instrument), 1 );
			stateChanged();
		};
		function getBeatDuration() {
			return 60000/$scope.loop_state.bpm;
		}

		$scope.bpmChange = function(diff) {
			//$scope.loop_state.bpm += diff;
			stateChanged();
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
			if (!$scope.loop_state.playing) {
				$scope.loop_state.playing = true;
				console.log('play');
				playback();
				timeout = setTimeout(update_clock, getBeatDuration());
			} else {
				$scope.loop_state.playing = false;
				clearTimeout(timeout);
			}
		};

		$scope.stop = function() {
			clearTimeout(timeout);
			$scope.loop_state.time = 0;
			$scope.loop_state.playing = false;
		};

		$scope.clear = function() {
			for (var instrument in $scope.loop_state.instruments) {
				$scope.loop_state.instruments[instrument].beats = [];
			}
			stateChanged();
		};
		$scope.total_beats = function() {
			return $scope.loop_state.num_bars*$scope.loop_state.beats_per_bar;
		};

		function time_tick() {
			$scope.loop_state.time = (($scope.loop_state.time + 1) % $scope.total_beats());
		}

		function playback() {
			for (var i=0;i<$scope.loop_state.instruments.length;i++) {
				var instrument = $scope.loop_state.instruments[i];
				if (instrument.beats[$scope.loop_state.time]) {
					$scope.playInstrument(instrument);
				}
			}
		}

		function update_clock() {

			time_tick();
			playback();
			$scope.$apply();
			if ($scope.loop_state.playing) {
				timeout = setTimeout(update_clock, getBeatDuration());
			}
		}
		$scope.sample_click = function(beat,instrument) {
			instrument.beats[beat] = !instrument.beats[beat];
			stateChanged();
		};
		$scope.at_time = function(i) {
			return $scope.loop_state.time == (i - 1);
		};

		$scope.pressed = function (beat, instrument) {
			return instrument.beats[beat];
		};

		$scope.beat_group = function(beat,group) {
			return Math.floor((beat-1)/$scope.loop_state.beats_per_bar)%2===(group-1);
		};

		function stateChanged() {
			saveState();
			//syncState();
		}
		function saveState() { //save state of loop
			var instrumentList = [];
			var beatList = [];
			for(var i=0;i<$scope.loop_state.instruments.length;i++) {
				var instrument = $scope.loop_state.instruments[i];
				instrumentList.push(instrument.sample);
				beatList.push(instrument.beats);
			}
			InstrData.addInstr(instrumentList, beatList, $scope.loop_state.bpm, $scope.loop_state.beats_per_bar, $scope.loop_state.num_bars);
		}

		function syncState(){	
			var state = {'sid' : sid, 'loop' : $scope.loop_state};
			socket.emit('toServer', state);
		}

		$scope.revertState = function() {
			var revState = InstrData.getRev();
			if(revState === null){
				alert('Nothing Saved yet.');
			} else {
				console.log(revState);

				$scope.loop_state.instruments = [];
				for (var i =0;i<revState.instrument.length;i++){
					$scope.loop_state.instruments[i] = {sample: "", beats: []};
				}
				for(var i = 0;i<revState.instrument.length;i++){
					$scope.loop_state.instruments[i].sample = revState.instrument[i];
					loadAudio($scope.loop_state.instruments[i].sample._id);
					$scope.loop_state.instruments[i].beats = revState.beats[i];
				}
				$scope.loop_state.bpm = revState.bpm;
				$scope.loop_state.beats_per_bar = revState.bpb;
				$scope.loop_state.num_bars = revState.numbars;
			}
		};

		$scope.isOnPlay = function() {
			return $scope.loop_state.playing;
		}

		$scope.incrNumBar = function() {
			if ($scope.loop_state.num_bars < 9) { //max number of bars
				$scope.loop_state.num_bars = $scope.loop_state.num_bars + 1;
			}
		}
		$scope.decrNumBar = function () {
			if ($scope.loop_state.num_bars > 1) {
				$scope.loop_state.num_bars = $scope.loop_state.num_bars - 1;
			}
		}

		$scope.incrBeatsPerBar = function() {
			if ($scope.loop_state.beats_per_bar < 9) { //max number of beats per bar
				$scope.loop_state.beats_per_bar = $scope.loop_state.beats_per_bar + 1;
			}
		}
		$scope.decrBeatsPerBar = function () {
			if ($scope.loop_state.beats_per_bar > 1) {
				$scope.loop_state.beats_per_bar = $scope.loop_state.beats_per_bar - 1;
			}
		}

		$scope.incrBPM = function() {
			if ($scope.loop_state.bpm < 995) {
				$scope.loop_state.bpm = $scope.loop_state.bpm + 5;
			}
		}
		$scope.decrBPM = function () {
			if ($scope.loop_state.bpm > 10) {
				$scope.loop_state.bpm = $scope.loop_state.bpm - 5;
			}
		}

		$scope.doubleBPM = function() {
			if (($scope.loop_state.bpm * 2 )< 999) { //max BPM is 995
				$scope.loop_state.bpm = $scope.loop_state.bpm * 2;
			}
			else {
				$scope.loop_state.bpm = 995;
			}
		}
		$scope.halfBPM = function () { //min BPM is 5
			if (($scope.loop_state.bpm/2) - (($scope.loop_state.bpm/2)%5) > 10) {
				$scope.loop_state.bpm = ($scope.loop_state.bpm/2) - (($scope.loop_state.bpm/2)%5);
			}
			else {
				$scope.loop_state.bpm = 10;
			}
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
