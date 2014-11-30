'use strict';

// Loops controller
angular.module('loops').controller('LoopsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Loops', '$http',
	function($scope, $stateParams, $location, Authentication, Loops, InstrData, $http ) {
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

		// checks if loop is public so it can be displayed in list-loops
		$scope.isPublic = function(loop){
			var isCollaborator = false;
			var members = loop.permissions.members;
			for(var i=0; i<members.length; i++){
				if (members[i] === $scope.authentication.user._id){
					isCollaborator = true;
				}
			}
			if ($scope.authentication.user._id === loop.user._id){
				return false;
			}
			else {
				if ((loop.permissions.mode === 'Public') && (isCollaborator === false)){
					return true;
				}
				else{
					return false;
				}
			}
		};

		//checks if user has access to a private loop. displays it in list-loops
		$scope.hasAccess = function(loop){
			if (loop.user._id === $scope.authentication.user._id){
				return true;
			}
			else{
				var members = loop.permissions.members;
				for(var i=0; i<members.length; i++){
					if (members[i] === $scope.authentication.user._id){
						return true;
					}
				}
				return false;
			}
		};
	}
]);