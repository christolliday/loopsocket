'use strict';

// Loops controller
angular.module('loops').controller('LoopsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Loops', 'InstrData',
	function($scope, $stateParams, $location, Authentication, Loops, InstrData) {
		$scope.authentication = Authentication;

		// Create new Loop
		$scope.create = function() {
			// Create new Loop object
			var loop = new Loops ({
				name: this.name
			});

			// Redirect after save
			loop.$save(function(response) {
				$location.path('loops/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Loop
		$scope.remove = function( loop ) {
			if ( loop ) { loop.$remove();

				for (var i in $scope.loops ) {
					if ($scope.loops [i] === loop ) {
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

		// Find a list of Loops
		$scope.find = function() {
			$scope.loops = Loops.query();
		};

		// Find existing Loop
		$scope.findOne = function() {
			$scope.loop = Loops.get({ 
				loopId: $stateParams.loopId
			});
		};

		// Update connected users
		$scope.updateConUsers = function() {
			var loop = $scope.loop;
		};

		$scope.updateState = function() {
			var loop = $scope.loop ;
			var loopState = InstrData.getInstr();

			loop.state = {
				instrument: loopState.instrument,
				beats: loopState.arr,
				bpm: loopState.bpm,
				bpb: loopState.bpb,
				numbars: loopState.numbars
			}

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
	}
]);