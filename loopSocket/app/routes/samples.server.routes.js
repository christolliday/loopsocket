'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var samples = require('../../app/controllers/samples.server.controller');
	var express = require('express');
	var router = express.Router();

	var load_sample = function(req, res) {
		var filename = req.params.sampleFile;
		if(filename)
		filename = ('./data/' + filename);
		console.log('Load sample: ' + filename);
		res.sendfile(filename);
	};

	// Samples Routes
	router.route('/samples')
		.get(samples.list)
		.post(users.requiresLogin, samples.create);

	router.route('/samples/:sampleId')
		.get(samples.read)
		//.put(users.requiresLogin, samples.hasAuthorization, samples.update)
		//.delete(users.requiresLogin, samples.hasAuthorization, samples.delete);
		.put(users.requiresLogin, samples.update)
		.delete(users.requiresLogin, samples.delete);

	router.route('/samples/play/:sampleFile')
		.get(load_sample);

	// Finish by binding the Sample middleware
	router.param('sampleId', samples.sampleByID);

	return router;
};