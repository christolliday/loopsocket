'use strict';

//Loops service used to communicate Loops REST endpoints
angular.module('loops').factory('Loops', ['$resource',
	function($resource) {
		return $resource('loops/:loopId', { loopId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('loops').factory('InstrData', function(){
	var instrumentList = {};

	var addInstr = function(instrument, arr, bpm, bpb, numbars) {
	  instrumentList.instrument = instrument;
	  instrumentList.arr = arr;
	  instrumentList.bpm = bpm;
	  instrumentList.bpb = bpb;
	  instrumentList.numbars = numbars;
	};

	var getInstr = function(){
	  return instrumentList;
	};

	var revertList = null;
	var setRev = function(list){
		revertList = list;
		console.log('set');
	};

	var getRev = function(){
		return revertList;
	};

	return {
		addInstr: addInstr,
		getInstr: getInstr,
		setRev: setRev,
		getRev: getRev
	};
});