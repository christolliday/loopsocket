'use strict';

module.exports = function(app) {

	var load_sample = function(req, res) {
		res.sendfile('./data/hi-hat-closed.wav');
	};

	app.route('/samples/:sampleId')
		.get(load_sample);
};