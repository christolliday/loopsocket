'use strict';

(function() {
	// Samples Controller Spec
	describe('Samples Controller Tests', function() {
		// Initialize global variables
		var SamplesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Samples controller.
			SamplesController = $controller('SamplesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Sample object fetched from XHR', inject(function(Samples) {
			// Create sample Sample using the Samples service
			var sampleSample = new Samples({
				name: 'New Sample'
			});

			// Create a sample Samples array that includes the new Sample
			var sampleSamples = [sampleSample];

			// Set GET response
			$httpBackend.expectGET('samples').respond(sampleSamples);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.samples).toEqualData(sampleSamples);
		}));

		it('$scope.findOne() should create an array with one Sample object fetched from XHR using a sampleId URL parameter', inject(function(Samples) {
			// Define a sample Sample object
			var sampleSample = new Samples({
				name: 'New Sample'
			});

			// Set the URL parameter
			$stateParams.sampleId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/samples\/([0-9a-fA-F]{24})$/).respond(sampleSample);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sample).toEqualData(sampleSample);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Samples) {
			// Create a sample Sample object
			var sampleSamplePostData = new Samples({
				name: 'New Sample'
			});

			// Create a sample Sample response
			var sampleSampleResponse = new Samples({
				_id: '525cf20451979dea2c000001',
				name: 'New Sample'
			});

			// Fixture mock form input values
			scope.name = 'New Sample';

			// Set POST response
			$httpBackend.expectPOST('samples', sampleSamplePostData).respond(sampleSampleResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Sample was created
			expect($location.path()).toBe('/samples/' + sampleSampleResponse._id);
		}));

		it('$scope.update() should update a valid Sample', inject(function(Samples) {
			// Define a sample Sample put data
			var sampleSamplePutData = new Samples({
				_id: '525cf20451979dea2c000001',
				name: 'New Sample'
			});

			// Mock Sample in scope
			scope.sample = sampleSamplePutData;

			// Set PUT response
			$httpBackend.expectPUT(/samples\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/samples/' + sampleSamplePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid sampleId and remove the Sample from the scope', inject(function(Samples) {
			// Create new Sample object
			var sampleSample = new Samples({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Samples array and include the Sample
			scope.samples = [sampleSample];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/samples\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSample);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.samples.length).toBe(0);
		}));
	});
}());