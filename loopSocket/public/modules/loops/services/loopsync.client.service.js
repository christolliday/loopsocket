'use strict';

angular.module('loops').factory('LoopSync', ['$stateParams', function($stateParams) {
	return function(receiveState,getState) {

		//var relpath = $location.path();
		//var sid = relpath.substring(7); // TO-DO use login var and extract lid/sid from there
		var sid = $stateParams.loopId;
		//console.log($stateParams.loopId);
		var connectedUsers = [];
		this.connectedUsers = connectedUsers;
		//console.log(sid);

		//var socket = io.connect('http://localhost:3000'); // port# not needed?!
		var socket = io(); // jshint ignore:line

		var sendState = function() {
			var state = {'sid' : sid, 'loop' : getState()};
			socket.emit('toServer', state);
		};
		this.sendState = sendState;

		var connect = function(userName) {
			socket.emit('conn', {'sid' : sid, 'userName' : userName});
		};
		this.connect = connect;

		var disconnect = function(userName) {
			socket.emit('disconn', {'sid' : sid, 'userName' : userName});
		};
		this.disconnect = disconnect;

		socket.emit('toServer_initNewClient', sid);
		socket.on('toAllClients_initNewClient', function(sidFromServer) {
			if (sidFromServer === sid) {
				sendState();
			}
		});
		socket.on('toAllClients', function (data) {
			//console.log(data);
			if (data.sid === sid){
				//console.log('Data for me!');
				receiveState(data);
			}
		});
		var activeUsersSocket = function() {
			//console.log("active_users_socket_init");
			socket.on('activeUsers', function (data) {
				//console.log(data);
				connectedUsers = [];
				for (var i = 0; i < data.length; i++){
					if (data[i].sid === sid){
						connectedUsers.push(data[i].userName);
					}
					console.log(connectedUsers);
				}
			});
		};
		this.activeUsersSocket = activeUsersSocket;

		var getActiveUsers = function() {
			return connectedUsers;
		};
		this.getActiveUsers = getActiveUsers;
	};

}]);