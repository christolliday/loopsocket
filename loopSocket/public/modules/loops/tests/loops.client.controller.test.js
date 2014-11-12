'use strict';

(function() {
	// Loops Controller Spec
	describe('Loops Controller Tests', function() {
		// Initialize global variables
		var LoopsController,
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

			// Initialize the Loops controller.
			LoopsController = $controller('LoopsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Loop object fetched from XHR', inject(function(Loops) {
			// Create sample Loop using the Loops service
			var sampleLoop = new Loops({
				name: 'New Loop'
			});

			// Create a sample Loops array that includes the new Loop
			var sampleLoops = [sampleLoop];

			// Set GET response
			$httpBackend.expectGET('loops').respond(sampleLoops);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.loops).toEqualData(sampleLoops);
		}));

		it('$scope.findOne() should create an array with one Loop object fetched from XHR using a loopId URL parameter', inject(function(Loops) {
			// Define a sample Loop object
			var sampleLoop = new Loops({
				name: 'New Loop'
			});

			// Set the URL parameter
			$stateParams.loopId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/loops\/([0-9a-fA-F]{24})$/).respond(sampleLoop);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.loop).toEqualData(sampleLoop);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Loops) {
			// Create a sample Loop object
			var sampleLoopPostData = new Loops({
				name: 'New Loop'
			});

			// Create a sample Loop response
			var sampleLoopResponse = new Loops({
				_id: '525cf20451979dea2c000001',
				name: 'New Loop'
			});

			// Fixture mock form input values
			scope.name = 'New Loop';

			// Set POST response
			$httpBackend.expectPOST('loops', sampleLoopPostData).respond(sampleLoopResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Loop was created
			expect($location.path()).toBe('/loops/' + sampleLoopResponse._id);
		}));

		it('$scope.update() should update a valid Loop', inject(function(Loops) {
			// Define a sample Loop put data
			var sampleLoopPutData = new Loops({
				_id: '525cf20451979dea2c000001',
				name: 'New Loop'
			});

			// Mock Loop in scope
			scope.loop = sampleLoopPutData;

			// Set PUT response
			$httpBackend.expectPUT(/loops\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/loops/' + sampleLoopPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid loopId and remove the Loop from the scope', inject(function(Loops) {
			// Create new Loop object
			var sampleLoop = new Loops({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Loops array and include the Loop
			scope.loops = [sampleLoop];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/loops\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLoop);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.loops.length).toBe(0);
		}));
	});
}());