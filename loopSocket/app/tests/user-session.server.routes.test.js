'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	UserSession = mongoose.model('UserSession'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, userSession;

/**
 * User session routes tests
 */
describe('User session CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new User session
		user.save(function() {
			userSession = {
				name: 'User session Name'
			};

			done();
		});
	});

	it('should be able to save User session instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User session
				agent.post('/user-sessions')
					.send(userSession)
					.expect(200)
					.end(function(userSessionSaveErr, userSessionSaveRes) {
						// Handle User session save error
						if (userSessionSaveErr) done(userSessionSaveErr);

						// Get a list of User sessions
						agent.get('/user-sessions')
							.end(function(userSessionsGetErr, userSessionsGetRes) {
								// Handle User session save error
								if (userSessionsGetErr) done(userSessionsGetErr);

								// Get User sessions list
								var userSessions = userSessionsGetRes.body;

								// Set assertions
								(userSessions[0].user._id).should.equal(userId);
								(userSessions[0].name).should.match('User session Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save User session instance if not logged in', function(done) {
		agent.post('/user-sessions')
			.send(userSession)
			.expect(401)
			.end(function(userSessionSaveErr, userSessionSaveRes) {
				// Call the assertion callback
				done(userSessionSaveErr);
			});
	});

	it('should not be able to save User session instance if no name is provided', function(done) {
		// Invalidate name field
		userSession.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User session
				agent.post('/user-sessions')
					.send(userSession)
					.expect(400)
					.end(function(userSessionSaveErr, userSessionSaveRes) {
						// Set message assertion
						(userSessionSaveRes.body.message).should.match('Please fill User session name');
						
						// Handle User session save error
						done(userSessionSaveErr);
					});
			});
	});

	it('should be able to update User session instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User session
				agent.post('/user-sessions')
					.send(userSession)
					.expect(200)
					.end(function(userSessionSaveErr, userSessionSaveRes) {
						// Handle User session save error
						if (userSessionSaveErr) done(userSessionSaveErr);

						// Update User session name
						userSession.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing User session
						agent.put('/user-sessions/' + userSessionSaveRes.body._id)
							.send(userSession)
							.expect(200)
							.end(function(userSessionUpdateErr, userSessionUpdateRes) {
								// Handle User session update error
								if (userSessionUpdateErr) done(userSessionUpdateErr);

								// Set assertions
								(userSessionUpdateRes.body._id).should.equal(userSessionSaveRes.body._id);
								(userSessionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of User sessions if not signed in', function(done) {
		// Create new User session model instance
		var userSessionObj = new UserSession(userSession);

		// Save the User session
		userSessionObj.save(function() {
			// Request User sessions
			request(app).get('/user-sessions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single User session if not signed in', function(done) {
		// Create new User session model instance
		var userSessionObj = new UserSession(userSession);

		// Save the User session
		userSessionObj.save(function() {
			request(app).get('/user-sessions/' + userSessionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', userSession.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete User session instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new User session
				agent.post('/user-sessions')
					.send(userSession)
					.expect(200)
					.end(function(userSessionSaveErr, userSessionSaveRes) {
						// Handle User session save error
						if (userSessionSaveErr) done(userSessionSaveErr);

						// Delete existing User session
						agent.delete('/user-sessions/' + userSessionSaveRes.body._id)
							.send(userSession)
							.expect(200)
							.end(function(userSessionDeleteErr, userSessionDeleteRes) {
								// Handle User session error error
								if (userSessionDeleteErr) done(userSessionDeleteErr);

								// Set assertions
								(userSessionDeleteRes.body._id).should.equal(userSessionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete User session instance if not signed in', function(done) {
		// Set User session user 
		userSession.user = user;

		// Create new User session model instance
		var userSessionObj = new UserSession(userSession);

		// Save the User session
		userSessionObj.save(function() {
			// Try deleting User session
			request(app).delete('/user-sessions/' + userSessionObj._id)
			.expect(401)
			.end(function(userSessionDeleteErr, userSessionDeleteRes) {
				// Set message assertion
				(userSessionDeleteRes.body.message).should.match('User is not logged in');

				// Handle User session error error
				done(userSessionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		UserSession.remove().exec();
		done();
	});
});