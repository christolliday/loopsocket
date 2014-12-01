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

		$scope.getMembers = function(index) {
			if($scope.loop.$resolved){
				return $scope.loop.permissions.members;
			}
		}

		$scope.addMember = function(user){
			console.log(user);
			$scope.loop.permissions.members.push(user);
			updateLoop();
			$scope.newMember = '';
		};

		$scope.deleteMember = function(user){
			var members = $scope.loop.permissions.members;
			for (var i=0; i<members.length; i++){
				if (user === members[i]._id){
					members.splice(i, 1);
					updateLoop();
					
					//redirect
					if (user == $scope.authentication.user._id){
						$location.path('loops/');
					}


				}
			}
		};

		$scope.makePublic = function(){
			var loop = $scope.loop;
			loop.permissions.mode = 'Public';
			updateLoop();
		};
		$scope.makePrivate = function(){
			var loop = $scope.loop;
			loop.permissions.mode = 'Private';
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
	
		}

		$scope.isCreatedByMe = function() {
			if($scope.loop.user._id	== $scope.authentication.user._id) {
				return true;
			}
			return false;
		}
	}
]);