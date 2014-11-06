'use strict';

(function() {
	// Sessions Controller Spec
	describe('Sessions Controller Tests', function() {
		// Initialize global variables
		var SessionsController,
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

			// Initialize the Sessions controller.
			SessionsController = $controller('SessionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Session object fetched from XHR', inject(function(Sessions) {
			// Create sample Session using the Sessions service
			var sampleSession = new Sessions({
				name: 'New Session'
			});

			// Create a sample Sessions array that includes the new Session
			var sampleSessions = [sampleSession];

			// Set GET response
			$httpBackend.expectGET('sessions').respond(sampleSessions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sessions).toEqualData(sampleSessions);
		}));

		it('$scope.findOne() should create an array with one Session object fetched from XHR using a sessionId URL parameter', inject(function(Sessions) {
			// Define a sample Session object
			var sampleSession = new Sessions({
				name: 'New Session'
			});

			// Set the URL parameter
			$stateParams.sessionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/sessions\/([0-9a-fA-F]{24})$/).respond(sampleSession);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.session).toEqualData(sampleSession);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Sessions) {
			// Create a sample Session object
			var sampleSessionPostData = new Sessions({
				name: 'New Session'
			});

			// Create a sample Session response
			var sampleSessionResponse = new Sessions({
				_id: '525cf20451979dea2c000001',
				name: 'New Session'
			});

			// Fixture mock form input values
			scope.name = 'New Session';

			// Set POST response
			$httpBackend.expectPOST('sessions', sampleSessionPostData).respond(sampleSessionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Session was created
			expect($location.path()).toBe('/sessions/' + sampleSessionResponse._id);
		}));

		it('$scope.update() should update a valid Session', inject(function(Sessions) {
			// Define a sample Session put data
			var sampleSessionPutData = new Sessions({
				_id: '525cf20451979dea2c000001',
				name: 'New Session'
			});

			// Mock Session in scope
			scope.session = sampleSessionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/sessions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/sessions/' + sampleSessionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid sessionId and remove the Session from the scope', inject(function(Sessions) {
			// Create new Session object
			var sampleSession = new Sessions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Sessions array and include the Session
			scope.sessions = [sampleSession];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/sessions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSession);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.sessions.length).toBe(0);
		}));
	});
}());