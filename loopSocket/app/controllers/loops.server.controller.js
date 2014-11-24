'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Loop = mongoose.model('Loop'),
	_ = require('lodash');


/**
 * Create a Loop
 */
exports.create = function(req, res) {
	var loop = new Loop(req.body);
	loop.user = req.user;

	loop.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(loop);
		}
	});
};

/**
 * Show the current Loop
 */
exports.read = function(req, res) {
	res.jsonp(req.loop);
};

/**
 * Update a Loop
 */
exports.update = function(req, res) {
	var loop = req.loop ;

	loop = _.extend(loop , req.body);

	loop.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(loop);
		}
	});
};

/**
 * Delete an Loop
 */
exports.delete = function(req, res) {
	var loop = req.loop ;

	loop.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(loop);
		}
	});
};

/**
 * List of Loops
 */
exports.list = function(req, res) { Loop.find().sort('-created').populate('user', 'displayName').exec(function(err, loops) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(loops);
		}
	});
};

/**
 * Loop middleware
 */
exports.loopByID = function(req, res, next, id) { Loop.findById(id).populate('user', 'displayName').exec(function(err, loop) {
		if (err) return next(err);
		if (! loop) return next(new Error('Failed to load Loop ' + id));
		req.loop = loop ;
		next();
	});
};

/**
 * Loop authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	var length = req.loop.member.length;
	if (req.loop.user.id == req.user.id) {
		next();
	}
	else{
		if (req.loop.member[0] == 'Public'){
			next();
		}
		else{
			for(var i=0; i<length; i++){
				if(req.user._id == req.loop.member[i]){
					return next();
				}
			}

		}
	}
};

exports.getMember = function(req, res){
	Loop.find().exec(function(err, docs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(docs);
		}
	});
};
