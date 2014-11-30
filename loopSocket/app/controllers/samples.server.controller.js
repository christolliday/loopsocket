'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Sample = mongoose.model('Sample'),
	_ = require('lodash');

/**
 * Create a Sample
 */
exports.create = function(req, res) {
	var sample = new Sample(req.body);
	sample.user = req.user;

	sample.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sample);
		}
	});
};

/**
 * Show the current Sample
 */
exports.read = function(req, res) {
	if(/audio\/wav/.test(req.get('accept'))) {
		var filename = req.sample.audiofile;
		if(filename === 'undefined') return res.status(404).send();
		filename = ('./data/' + filename);
		console.log('Load sample: ' + filename);
		res.sendfile(filename);
	} else {
		res.jsonp(req.sample);
	}
};

/**
 * Update a Sample
 */
exports.update = function(req, res) {
	var sample = req.sample ;

	sample = _.extend(sample , req.body);

	sample.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sample);
		}
	});
};

/**
 * Delete an Sample
 */
exports.delete = function(req, res) {
	var sample = req.sample ;

	sample.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sample);
		}
	});
};

/**
 * List of Samples
 */
exports.list = function(req, res) { 
	Sample.find().sort('-created').populate('user', 'username').exec(function(err, samples) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(samples);
		}
	});
};

/**
 * Sample middleware
 */
exports.sampleByID = function(req, res, next, id) { 
	Sample.findById(id).populate('user', 'username').exec(function(err, sample) {
		if (err) return next(err);
		if (! sample) return next(new Error('Failed to load Sample ' + id));
		req.sample = sample;
		next();
	});
};

/**
 * Sample authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.sample.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};