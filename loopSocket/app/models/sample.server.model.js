'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Sample Schema
 */
var SampleSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Sample name',
		trim: true
	},
	audiofile: {
		type: String,
		default:'',
		required: 'Please fill audio file name',
		trime: true
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

mongoose.model('Sample', SampleSchema);