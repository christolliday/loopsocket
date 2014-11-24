'use strict';

// Samples controller
angular.module('samples').controller('SamplesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Samples',
	function($scope, $stateParams, $location, Authentication, Samples) {
		$scope.authentication = Authentication;

		// Create new Sample
		$scope.create = function() {
			// Create new Sample object
			var sample = new Samples ({
				name: this.name,
				audiofile: this.audiofile
			});

			// Redirect after save
			sample.$save(function(response) {
				$location.path('samples/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.audiofile = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Sample
		$scope.remove = function(sample) {
			if ( sample ) { 
				sample.$remove();

				for (var i in $scope.samples) {
					if ($scope.samples [i] === sample) {
						$scope.samples.splice(i, 1);
					}
				}
			} else {
				$scope.sample.$remove(function() {
					$location.path('samples');
				});
			}
		};

		// Update existing Sample
		$scope.update = function() {
			var sample = $scope.sample;

			sample.$update(function() {
				$location.path('samples/' + sample._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Samples
		$scope.find = function() {
			$scope.samples = Samples.query();
		};

		//test
		$scope.findVar = function() {
			//var samps = [];
			var samps = Samples.query();
			console.log(samps);
			return samps;
		};

		$scope.defSamp = function(sname){
			var samp = Samples.get({ 
				sampleId: '54618dbc29e9de6dcb412bb8'
			});
			console.log(samp);
			return samp.name;
		};

		// Find existing Sample
		$scope.findOne = function() {
			$scope.sample = Samples.get({ 
				sampleId: $stateParams.sampleId
			});
		};

		$scope.play = function(sampleid) {
			var audio = new Audio('samples/'+sampleid);
			audio.play();
			console.log(audio);
		};
	}
]);
