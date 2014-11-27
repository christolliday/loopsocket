'use strict';

// Loops controller
angular.module('loops').controller('EditLoopController', ['$scope', '$stateParams', '$location', 'Authentication', 'Loops', 'InstrData',
	function($scope, $stateParams, $location, Authentication, Loops, InstrData) {
		$scope.authentication = Authentication;

		//$scope.loop = {};
		$scope.loop = Loops.get({ 
				loopId: $stateParams.loopId
			});

		// Remove existing Loop
		$scope.remove = function() {
			if ( $scope.loop ) { $scope.loop.$remove();

				for (var i in $scope.loops ) {
					if ($scope.loops [i] === $scope.loop ) {
						$scope.loops.splice(i, 1);
					}
				}
			} else {
				$scope.loop.$remove(function() {
					$location.path('loops');
				});
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
			var loop = $scope.loop ;
			var loopState = InstrData.getInstr();

			console.log(JSON.stringify($scope.loop_container,null,2));

			loop.state = {
				instrument: loopState.instrument,
				beats: loopState.arr,
				bpm: loopState.bpm,
				bpb: loopState.bpb,
				numbars: loopState.numbars
			};

			loop.$update(function() {
				$location.path('loops/' + loop._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			sendState();
		};

		function sendState() {
			var revState = Loops.get({
				loopId: $stateParams.loopId
			});

			revState.$promise.then(function(data) {
				InstrData.setRev(data.state);
			});
		}

		$scope.show_settings = false;
	}
]);