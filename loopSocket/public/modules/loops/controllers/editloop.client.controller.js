'use strict';

// Loops controller
angular.module('loops').controller('EditLoopController', ['$scope', '$stateParams', '$location', 'Authentication', 'Loops',
	function($scope, $stateParams, $location, Authentication, Loops) {
		$scope.authentication = Authentication;

		//$scope.loop = {};
		$scope.findOne = function(){
			$scope.loop = Loops.get({
				loopId: $stateParams.loopId
			});
		};

		// Remove existing Loop
		$scope.remove = function() {
			$scope.loop.$remove(function() {
				$location.path('loops');
			});
		};

		// Update existing Loop
		$scope.update = function() {
			var loop = $scope.loop ;
			loop.$update(function() {
				$location.path('loops/' + loop._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Update connected users
		$scope.updateConUsers = function() {
			var loop = $scope.loop;
		};

		$scope.updateState = function() {
			var loop = $scope.loop;
			console.log('server');
			console.log(loop);

			loop.$update(function() {
				$location.path('loops/' + loop._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.revertState = function() {
			var revState = Loops.get({
				loopId: $stateParams.loopId
			});
			revState.$promise.then(function(data) {
				console.log('revertState');
				$scope.$broadcast('revert', data);
			});
		};

		$scope.show_settings = false;
	}
]);