'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var samples = require('../../app/controllers/samples.server.controller');

	var load_sample = function(req, res) {
		var filename = req.params.sampleFile;
		if(filename)
		filename = ('./data/' + filename);
		console.log('Load sample: ' + filename);
		res.sendfile(filename);
	};

	// Samples Routes
	app.route('/samples')
		.get(samples.list)
		.post(users.requiresLogin, samples.create);

	app.route('/samples/:sampleId')
		.get(samples.read)
		.put(users.requiresLogin, samples.hasAuthorization, samples.update)
		.delete(users.requiresLogin, samples.hasAuthorization, samples.delete);

	app.route('/samples/play/:sampleFile')
		.get(load_sample);

	// Finish by binding the Sample middleware
	app.param('sampleId', samples.sampleByID);
};