'use strict';

// User sessions controller
angular.module('user-sessions').controller('UserSessionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'UserSessions',
	function($scope, $stateParams, $location, Authentication, UserSessions) {
		$scope.authentication = Authentication;

		// Create new User session
		$scope.create = function() {
			// Create new User session object
			var userSession = new UserSessions ({
				name: this.name
			});

			// Redirect after save
			userSession.$save(function(response) {
				$location.path('user-sessions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing User session
		$scope.remove = function(userSession) {
			if ( userSession ) { 
				userSession.$remove();

				for (var i in $scope.userSessions) {
					if ($scope.userSessions [i] === userSession) {
						$scope.userSessions.splice(i, 1);
					}
				}
			} else {
				$scope.userSession.$remove(function() {
					$location.path('user-sessions');
				});
			}
		};

		// Update existing User session
		$scope.update = function() {
			var userSession = $scope.userSession;

			userSession.$update(function() {
				$location.path('user-sessions/' + userSession._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of User sessions
		$scope.find = function() {
			$scope.userSessions = UserSessions.query();
		};

		// Find existing User session
		$scope.findOne = function() {
			$scope.userSession = UserSessions.get({ 
				userSessionId: $stateParams.userSessionId
			});
		};
	}
]);