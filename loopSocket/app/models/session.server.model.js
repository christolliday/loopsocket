'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Session Schema
 */
var SessionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Session name',
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

mongoose.model('Session', SessionSchema);