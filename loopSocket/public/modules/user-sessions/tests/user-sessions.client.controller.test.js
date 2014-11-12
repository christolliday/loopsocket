'use strict';

(function() {
	// User sessions Controller Spec
	describe('User sessions Controller Tests', function() {
		// Initialize global variables
		var UserSessionsController,
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

			// Initialize the User sessions controller.
			UserSessionsController = $controller('UserSessionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one User session object fetched from XHR', inject(function(UserSessions) {
			// Create sample User session using the User sessions service
			var sampleUserSession = new UserSessions({
				name: 'New User session'
			});

			// Create a sample User sessions array that includes the new User session
			var sampleUserSessions = [sampleUserSession];

			// Set GET response
			$httpBackend.expectGET('user-sessions').respond(sampleUserSessions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.userSessions).toEqualData(sampleUserSessions);
		}));

		it('$scope.findOne() should create an array with one User session object fetched from XHR using a userSessionId URL parameter', inject(function(UserSessions) {
			// Define a sample User session object
			var sampleUserSession = new UserSessions({
				name: 'New User session'
			});

			// Set the URL parameter
			$stateParams.userSessionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/user-sessions\/([0-9a-fA-F]{24})$/).respond(sampleUserSession);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.userSession).toEqualData(sampleUserSession);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(UserSessions) {
			// Create a sample User session object
			var sampleUserSessionPostData = new UserSessions({
				name: 'New User session'
			});

			// Create a sample User session response
			var sampleUserSessionResponse = new UserSessions({
				_id: '525cf20451979dea2c000001',
				name: 'New User session'
			});

			// Fixture mock form input values
			scope.name = 'New User session';

			// Set POST response
			$httpBackend.expectPOST('user-sessions', sampleUserSessionPostData).respond(sampleUserSessionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the User session was created
			expect($location.path()).toBe('/user-sessions/' + sampleUserSessionResponse._id);
		}));

		it('$scope.update() should update a valid User session', inject(function(UserSessions) {
			// Define a sample User session put data
			var sampleUserSessionPutData = new UserSessions({
				_id: '525cf20451979dea2c000001',
				name: 'New User session'
			});

			// Mock User session in scope
			scope.userSession = sampleUserSessionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/user-sessions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/user-sessions/' + sampleUserSessionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid userSessionId and remove the User session from the scope', inject(function(UserSessions) {
			// Create new User session object
			var sampleUserSession = new UserSessions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new User sessions array and include the User session
			scope.userSessions = [sampleUserSession];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/user-sessions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUserSession);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.userSessions.length).toBe(0);
		}));
	});
}());