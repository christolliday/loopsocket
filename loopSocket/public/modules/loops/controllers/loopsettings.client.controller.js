'use strict';

// Loops controller
angular.module('loops').controller('LoopSettingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Loops', '$http',
	function($scope, $stateParams, $location, Authentication, Loops, $http) {
		$scope.authentication = Authentication;

		$scope.loop = Loops.get({
				loopId: $stateParams.loopId
			});

		var userInfo;

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
		};
		$scope.checkPerson = function(index){

			if($scope.loop.$resolved) {
				var length = $scope.loop.member.length;
				for (var i=0; i<length; i++){
					if (userInfo[index]._id === $scope.loop.member[i]){
						return false;
					}
				}
				if ($scope.loop.user._id === userInfo[index]._id){
					return false;
				}
				else{
					return true;
				}
			}
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
			var loop = $scope.loop;
			if (loop.permission_mode === 'Public'){
				return false;
			}
			else{
				return true;
			}
		};
		$scope.isPrivate = function(){
			var loop = $scope.loop;
			if (loop.permission_mode === 'Private'){
				return false;
			}
			else{
				return true;
			}

		};
	}
]);