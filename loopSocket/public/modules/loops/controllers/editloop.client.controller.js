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

		$scope.showControls = function() {
			if($scope.authentication.user && ($scope.authentication.user._id == $scope.loop.user._id)) {
				return true;
			} else {
				for (var i=0; i<$scope.loop.member.length; i++){
					if ($scope.authentication.user._id === $scope.loop.member[i]) {
						return true;
					}
				}
				return false;
			}
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
				$scope.$broadcast('revert', data);
			});
		};

		$scope.show_settings = false;

		$scope.isSettingsVisible = function() {
			return $scope.show_settings;
		}

		$scope.showSettings = function() {
			$scope.show_settings = true;
		}

		$scope.hideSettings = function() {
			$scope.show_settings = false;
		}
	}
]);