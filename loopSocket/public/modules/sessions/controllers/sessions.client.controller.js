'use strict';

// Sessions controller
angular.module('sessions').controller('SessionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sessions',
	function($scope, $stateParams, $location, Authentication, Sessions ) {
		$scope.authentication = Authentication;

		// Create new Session
		$scope.create = function() {
			// Create new Session object
			var session = new Sessions ({
				name: this.name
			});

			// Redirect after save
			session.$save(function(response) {
				$location.path('sessions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Session
		$scope.remove = function( session ) {
			if ( session ) { session.$remove();

				for (var i in $scope.sessions ) {
					if ($scope.sessions [i] === session ) {
						$scope.sessions.splice(i, 1);
					}
				}
			} else {
				$scope.session.$remove(function() {
					$location.path('sessions');
				});
			}
		};

		// Update existing Session
		$scope.update = function() {
			var session = $scope.session ;

			session.$update(function() {
				$location.path('sessions/' + session._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Sessions
		$scope.find = function() {
			$scope.sessions = Sessions.query();
		};

		// Find existing Session
		$scope.findOne = function() {
			$scope.session = Sessions.get({ 
				sessionId: $stateParams.sessionId
			});
		};
	}
]);