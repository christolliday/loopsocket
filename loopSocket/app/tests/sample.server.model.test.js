'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Sample = mongoose.model('Sample');

/**
 * Globals
 */
var user, sample;

/**
 * Unit tests
 */
describe('Sample Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			sample = new Sample({
				name: 'Sample Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return sample.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			sample.name = '';

			return sample.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Sample.remove().exec();
		User.remove().exec();

		done();
	});
});