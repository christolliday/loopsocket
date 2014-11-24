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
	},
	member: {
		type: Array,
		default: ['Private']
	},
	/*connected: [ConnectUsers],*/
	state: {
		instrument: { type: Array},
		beats: {type: Array},
		bpm: {type: Number},
		bpb: {type: Number},
		numbars: { type: Number}
	}
});

mongoose.model('Loop', LoopSchema);