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
		}

		$scope.addMember = function(user){
			var loop = $scope.loop;
			var length = $scope.loop.member.length;
			loop.member[length] = user._id;
			loop.$update(function() {
				$location.path('loops/' + loop._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.isMember = function(index){
			if($scope.loop.$resolved) {
				for (var i=0; i<$scope.loop.member.length; i++){
					if ($scope.users[index]._id === $scope.loop.member[i]){
						return false;
					}
				}
				if ($scope.loop.user._id === $scope.users[index]._id){
					return false;
				}
			}
			return true;
		};
		$scope.makePublic = function(){
			var loop = $scope.loop;
			loop.permission_mode = 'Public';
			loop.$update(function() {
				$location.path('loops/' + loop._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.makePrivate = function(){
			var loop = $scope.loop;
			loop.permission_mode = 'Private';
			loop.$update(function() {
				$location.path('loops/' + loop._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.isPublic = function(){
			return $scope.loop.permission_mode === 'Public';
		};
		$scope.isPrivate = function(){
			return $scope.loop.permission_mode === 'Private';
		};

		// ???
		$scope.checkList = function(index){
			/*var list = $scope.listMembers[index];
			var length = $scope.listMembers[index].member.length;
			if ($scope.listMembers[index].permission_mode === 'Public'){
				return false;
			}
			else{
				if ($scope.listMembers[index].user._id === $scope.user._id){
					return false;
				}
				else{
					return true;
				}
			}*/
		};
	}
]);