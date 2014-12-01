'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//Object for connected users
/*var ConnectUsers = new Schema({
    name: {
		type: String,
		trim: true,
		default: ''
    }
});*/

/**
 * Loop Schema
 */
var LoopSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please enter Loop name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	/*connected: [ConnectUsers],*/
	state: {
		instruments: { type: Array},
		bpm: {type: Number},
		beats_per_bar: {type: Number},
		num_bars: { type: Number}
	},
	permissions: {
		mode: {
			type: String,
			default: 'Private'
		},
		members: [{
			type: Schema.ObjectId,
			ref: 'User'
		}]
	}
});

mongoose.model('Loop', LoopSchema);