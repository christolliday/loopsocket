'use strict';

// Loops controller
angular.module('loops').controller('LoopSettingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Loops', '$http', 'Users',
	function($scope, $stateParams, $location, Authentication, Loops, $http, Users) {
		$scope.authentication = Authentication;

		$scope.loop = Loops.get({
				loopId: $stateParams.loopId
			});

		$scope.users = Users.query();

		$scope.getUsers = function(index){
			return $scope.users;
		};

		// gets users that are not in the loop
		$scope.getNonMembers = function(){
			var otherUsers = [];
			var length = $scope.users.length;
			var looplength = $scope.loop.permissions.members.length;
			for (var i=0; i<length; i++){
				if ($scope.users[i]._id !== $scope.loop.user._id){
					if (looplength === 0){
						otherUsers.push($scope.users[i]);
					}
					else{
						for (var j=0; j<looplength; j++){
							if($scope.users[i]._id === $scope.loop.permissions.members[j]._id){
								break;
							}
							else{
								if (($scope.users[i]._id !== $scope.loop.permissions.members[j]._id) && (j===(looplength-1))){
									otherUsers.push($scope.users[i]);
								}
							}
						}
					}
				}
			}
			return otherUsers;
		};

		$scope.getMembers = function(index) {
			if($scope.loop.$resolved){
				return $scope.loop.permissions.members;
			}
		};

		function validUsername(user) {
			var nonMembers = $scope.getNonMembers();
			for(var i=0; i<nonMembers.length; i++) {
			 	if (user === nonMembers[i].username) {
			 		return true;
			 	}
			}
			return false;
		}

		function getObjectID(user) {
			var nonMembers = $scope.getNonMembers();
			for(var i=0; i<nonMembers.length; i++) {
			 	if (user === nonMembers[i].username) {
			 		return nonMembers[i];
			 	}
			}
		}

		$scope.addError = false;

		$scope.getAddError = function () {
			return $scope.addError;
		};

		$scope.addMember = function(user){
			if (validUsername(user)) {
				var addUser = getObjectID(user);
				$scope.loop.permissions.members.push(addUser);
				updateLoop();
				$scope.newMember = '';
				$scope.addError = false;
			}
			else {
				$scope.newMember = '';
				$scope.addError = true;
			}


			
		};

		$scope.deleteMember = function(user){
			var members = $scope.loop.permissions.members;
			for (var i=0; i<members.length; i++){
				if (user === members[i]._id){
					members.splice(i, 1);
					updateLoop();
					
					//redirect
					if (user === $scope.authentication.user._id){
						$location.path('loops/');
					}


				}
			}
		};

		$scope.makePublic = function(){
			$scope.loop.permissions.mode = 'Public';
			updateLoop();
		};
		$scope.makePrivate = function(){
			$scope.loop.permissions.mode = 'Private';
			updateLoop();
		};
		$scope.isMember = function(user){
			if($scope.loop.$resolved&&user) {
				var members = $scope.loop.permissions.members;
				for (var i=0; i<members.length; i++){
					if (user._id === members[i]._id){
						return true;
					}
				}
				if (user._id === $scope.loop.user._id){
					return true;
				}
			}
			return false;
		};

		$scope.hasMembers = function(){
			if(!$scope.loop.$resolved) return false;
			return $scope.loop.permissions.members.length!==0;
		}
		$scope.isPublic = function(){
			if(!$scope.loop.$resolved) return false;
			return $scope.loop.permissions.mode === 'Public';
		};
		$scope.isPrivate = function(){
			if(!$scope.loop.$resolved) return false;
			return $scope.loop.permissions.mode === 'Private';
		};

		function updateLoop() {
			$scope.loop.$update(function() {
				$location.path('loops/' + $scope.loop._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		}

		$scope.updateLoopName = function() {
			updateLoop();
		};

		$scope.isCreatedByMe = function() {
			if(!$scope.loop.$resolved) return false;
			if($scope.loop.user._id	=== $scope.authentication.user._id) {
				return true;
			}
			return false;
		};
	}
]);