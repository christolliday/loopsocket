'use strict';

module.exports = function(app) {
	var express = require('express');
	var router = express.Router();
	// Root routing
	var core = require('../../app/controllers/core');
	router.route('/').get(core.index);

	return router;
};