'use strict';

angular.module('loops').factory('LoopSync', ['$location', function($location) {
	return function(receiveState,getState) {

		var relpath = $location.path();
		var sid = relpath.substring(7);
		//console.log(sid);

		//var socket = io.connect('http://localhost:3000'); // port# not needed?!
		var socket = io(); // jshint ignore:line

		var sendState = function() {
			var state = {'sid' : sid, 'loop' : getState()};
			socket.emit('toServer', state);
		};
		this.sendState = sendState;

		socket.emit('toServer_initNewClient', sid);
		socket.on('toAllClients_initNewClient', function(sidFromServer) {
			if (sidFromServer === sid) {
				sendState();
			}
		});
		socket.on('toAllClients', function (data) {
			console.log(data);
			if (data.sid === sid){
				console.log('Data for me!');
				receiveState(data);
			}
		});
	};

}]);