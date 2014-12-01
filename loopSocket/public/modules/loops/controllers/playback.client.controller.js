'use strict';


// Sessions controller
angular.module('loops').controller('PlaybackController', ['$scope', '$document', 'Samples', '$interval', 'LoopSync',
	function($scope, $document, Samples, $interval, LoopSync) {

		var getState = function() {
			return $scope.loop_state;
		};
		var receiveState = function(data) {
			var time = $scope.loop_state.time;
			var playing = $scope.loop_state.playing;
			data.loop.playing = playing;
			data.loop.time = time;
			$scope.loop_state = data.loop;
			$scope.loop_state.playing = playing;
			$scope.loop_state.time = time;
			$scope.$apply();
		};

		$scope.$on('loadpage', function(event, args) {
			if(args.state.instruments.length === 0){
				console.log('empty');
				//clear it instead?
				initLoop();
			} else {
				console.log('load page');
				$scope.loop_state = args.state;
				$scope.loop_state.playing = false;
				$scope.loop_state.time = 0;
			}
			clearTimeout(timeout);
			//stateChanged();
		});

		var loopsync = new LoopSync(receiveState,getState);

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
		//$scope.loop.loop_state = $scope.loop_state;

		function initLoop() {
			$scope.loop_state.bpm = 100;
			$scope.loop_state.time = 0;
			$scope.loop_state.num_bars = 4;
			$scope.loop_state.beats_per_bar = 4;
			$scope.loop_state.playing = false;
			$scope.loop_state.instruments = [];
			for(var i=0;i<default_num_samples;i++) {
				$scope.loop_state.instruments[i] = {beats:[]};
				var sample = $scope.samples[i];
				$scope.loop_state.instruments[i].sample = {'_id':sample._id,'name':sample.name};
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

		$scope.getSamples = function() {
			return $scope.samples;
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




		$scope.play = function() {
			if (!$scope.loop_state.playing) {
				$scope.loop_state.playing = true;
				playback();
				timeout = setTimeout(updateClock, getBeatDuration());
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

		$scope.getTotalBeats = function() {
			return $scope.loop_state.num_bars*$scope.loop_state.beats_per_bar;
		};

		function timeTick() {
			$scope.loop_state.time = (($scope.loop_state.time + 1) % $scope.getTotalBeats());
		}

		function playback() {
			for (var i=0;i<$scope.loop_state.instruments.length;i++) {
				var instrument = $scope.loop_state.instruments[i];
				if (instrument.beats[$scope.loop_state.time]) {
					$scope.playInstrument(instrument);
				}
			}
		}

		function updateClock() {
			timeTick();
			playback();
			$scope.$apply();
			if ($scope.loop_state.playing) {
				timeout = setTimeout(updateClock, getBeatDuration());
			}
		}
		$scope.toggleBeat = function(beat,instrument) {
			instrument.beats[beat] = !instrument.beats[beat];
			stateChanged();
		};
		$scope.atTime = function(time) {
			return $scope.loop_state.time === time;
		};

		$scope.beatEnabled = function (beat, instrument) {
			return instrument.beats[beat];
		};

		$scope.beatGroup = function(beat,group) {
			return Math.floor((beat)/$scope.loop_state.beats_per_bar)%2===(group-1);
		};

		function stateChanged() {
			loopsync.sendState();
			$scope.$parent.loop.state = $scope.loop_state;
		}

		$scope.$on('revert', function(event, args) {
			if(args.state.instruments.length === 0){
				initLoop();
			} else {
				$scope.loop_state = args.state;
				$scope.loop_state.playing = false;
				$scope.loop_state.time = 0;
			}
			clearTimeout(timeout);
			stateChanged();
		});

		$scope.getInstruments = function() {
			return $scope.loop_state.instruments;
		};

		$scope.getTime = function() {
			return $scope.loop_state.time;
		};
		$scope.isPlaying = function() {
			return $scope.loop_state.playing;
		};
		$scope.getNumBeatsPerBar = function() {
			return $scope.loop_state.beats_per_bar;
		};
		$scope.getNumBars = function() {
			return $scope.loop_state.num_bars;
		};
		$scope.getBpm = function() {
			return $scope.loop_state.bpm;
		};

		$scope.getAdder = function(factor) {
			return function(val) {
				return val+factor;
			};
		};
		$scope.getMultiplier = function(factor) {
			return function(val) {
				return val*factor;
			};
		};
		$scope.changeBeatsPerBar = function(modifier) {
			$scope.loop_state.beats_per_bar = Math.min(9,Math.max(1,modifier($scope.loop_state.beats_per_bar)));
			stateChanged();
		};
		$scope.changeNumBars = function(modifier) {
			$scope.loop_state.num_bars = Math.min(9,Math.max(1,modifier($scope.loop_state.num_bars)));
			stateChanged();
		};
		$scope.changeBpm = function(modifier) {
			$scope.loop_state.bpm = Math.min(995,Math.max(10,modifier($scope.loop_state.bpm)));
			$scope.loop_state.bpm = Math.round($scope.loop_state.bpm/5)*5;
			stateChanged();
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
