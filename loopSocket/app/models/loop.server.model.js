'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Loop Schema
 */
var LoopSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Loop name',
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

mongoose.model('Loop', LoopSchema);