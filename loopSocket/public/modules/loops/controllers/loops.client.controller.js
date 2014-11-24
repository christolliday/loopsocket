'use strict';

// Loops controller
angular.module('loops').controller('LoopsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Loops', '$http',
	function($scope, $stateParams, $location, Authentication, Loops, $http ) {
		$scope.authentication = Authentication;


		var userInfo;

		$scope.information = {};
		$http.get('../../users')
		.success(function(data){
			$scope.information = data;
			userInfo = data;
		});

		$scope.listMembers = {};
		$http.get('/members')
		.success(function(data){
			$scope.listMembers = data;
		});
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
			var loop = $scope.loop;
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
		};
		$scope.makePublic = function(){
			var loop = $scope.loop;
			loop.member[0] = 'Public';
			loop.$update(function() {
				$location.path('loops/' + loop._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.makePrivate = function(){
			var loop = $scope.loop;
			loop.member[0] = 'Private';
			loop.$update(function() {
				$location.path('loops/' + loop._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		$scope.isPublic = function(){
			var loop = $scope.loop;
			if (loop.member[0] === 'Public'){
				return false;
			}
			else{
				return true;
			}

		};
		$scope.isPrivate = function(){
			var loop = $scope.loop;
			if (loop.member[0] === 'Private'){
				return false;
			}
			else{
				return true;
			}

		};

		$scope.checkList = function(index){
			var list = $scope.listMembers[index];
			var length = $scope.listMembers[index].member.length;
			if ($scope.listMembers[index].member[0] == 'Public'){
				console.log('1');
				return false;
			}
			else{
				if ($scope.listMembers[index].user._id == $scope.user._id){
					console.log('2');
					return false;
				}
				else{
					return true;
				}
			}
		};
	}
]);