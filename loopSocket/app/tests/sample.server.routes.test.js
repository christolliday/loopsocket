'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Sample = mongoose.model('Sample'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, sample;

/**
 * Sample routes tests
 */
describe('Sample CRUD tests', function() {
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

		// Save a user to the test db and create new Sample
		user.save(function() {
			sample = {
				name: 'Sample Name'
			};

			done();
		});
	});

	it('should be able to save Sample instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sample
				agent.post('/samples')
					.send(sample)
					.expect(200)
					.end(function(sampleSaveErr, sampleSaveRes) {
						// Handle Sample save error
						if (sampleSaveErr) done(sampleSaveErr);

						// Get a list of Samples
						agent.get('/samples')
							.end(function(samplesGetErr, samplesGetRes) {
								// Handle Sample save error
								if (samplesGetErr) done(samplesGetErr);

								// Get Samples list
								var samples = samplesGetRes.body;

								// Set assertions
								(samples[0].user._id).should.equal(userId);
								(samples[0].name).should.match('Sample Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Sample instance if not logged in', function(done) {
		agent.post('/samples')
			.send(sample)
			.expect(401)
			.end(function(sampleSaveErr, sampleSaveRes) {
				// Call the assertion callback
				done(sampleSaveErr);
			});
	});

	it('should not be able to save Sample instance if no name is provided', function(done) {
		// Invalidate name field
		sample.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sample
				agent.post('/samples')
					.send(sample)
					.expect(400)
					.end(function(sampleSaveErr, sampleSaveRes) {
						// Set message assertion
						(sampleSaveRes.body.message).should.match('Please fill Sample name');
						
						// Handle Sample save error
						done(sampleSaveErr);
					});
			});
	});

	it('should be able to update Sample instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sample
				agent.post('/samples')
					.send(sample)
					.expect(200)
					.end(function(sampleSaveErr, sampleSaveRes) {
						// Handle Sample save error
						if (sampleSaveErr) done(sampleSaveErr);

						// Update Sample name
						sample.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Sample
						agent.put('/samples/' + sampleSaveRes.body._id)
							.send(sample)
							.expect(200)
							.end(function(sampleUpdateErr, sampleUpdateRes) {
								// Handle Sample update error
								if (sampleUpdateErr) done(sampleUpdateErr);

								// Set assertions
								(sampleUpdateRes.body._id).should.equal(sampleSaveRes.body._id);
								(sampleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Samples if not signed in', function(done) {
		// Create new Sample model instance
		var sampleObj = new Sample(sample);

		// Save the Sample
		sampleObj.save(function() {
			// Request Samples
			request(app).get('/samples')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Sample if not signed in', function(done) {
		// Create new Sample model instance
		var sampleObj = new Sample(sample);

		// Save the Sample
		sampleObj.save(function() {
			request(app).get('/samples/' + sampleObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', sample.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Sample instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sample
				agent.post('/samples')
					.send(sample)
					.expect(200)
					.end(function(sampleSaveErr, sampleSaveRes) {
						// Handle Sample save error
						if (sampleSaveErr) done(sampleSaveErr);

						// Delete existing Sample
						agent.delete('/samples/' + sampleSaveRes.body._id)
							.send(sample)
							.expect(200)
							.end(function(sampleDeleteErr, sampleDeleteRes) {
								// Handle Sample error error
								if (sampleDeleteErr) done(sampleDeleteErr);

								// Set assertions
								(sampleDeleteRes.body._id).should.equal(sampleSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Sample instance if not signed in', function(done) {
		// Set Sample user 
		sample.user = user;

		// Create new Sample model instance
		var sampleObj = new Sample(sample);

		// Save the Sample
		sampleObj.save(function() {
			// Try deleting Sample
			request(app).delete('/samples/' + sampleObj._id)
			.expect(401)
			.end(function(sampleDeleteErr, sampleDeleteRes) {
				// Set message assertion
				(sampleDeleteRes.body.message).should.match('User is not logged in');

				// Handle Sample error error
				done(sampleDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Sample.remove().exec();
		done();
	});
});