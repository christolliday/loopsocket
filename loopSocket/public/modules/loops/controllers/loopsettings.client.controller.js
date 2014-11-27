'use strict';

// Loops controller
angular.module('loops').controller('LoopSettingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Loops', '$http', 'Users',
	function($scope, $stateParams, $location, Authentication, Loops, $http, Users) {
		$scope.authentication = Authentication;

		$scope.loop = Loops.get({
				loopId: $stateParams.loopId
			});

		$scope.users = Users.query();

<<<<<<< HEAD
		$scope.information = {};
		$http.get('../../users').success(function(data){
			$scope.information = data;
			userInfo = data;
		});


		$scope.addPerson = function(index){
			var loop = $scope.loop;
			var length = $scope.loop.member.length;
			loop.member[length] = userInfo[index]._id;
			loop.$update(function() {
				$location.path('loops/' + loop._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
=======
		$scope.getUsers = function(index){
			return $scope.users;
>>>>>>> 0969514c4eebf294e1dfadf71f6ace9d76c2ef69
		};

		$scope.addMember = function(user){
			$scope.loop.permissions.members.push(user._id);
			updateLoop();
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
					if (user._id === members[i]){
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
	}
]);