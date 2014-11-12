'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * User session Schema
 */
var UserSessionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill User session name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('UserSession', UserSessionSchema);