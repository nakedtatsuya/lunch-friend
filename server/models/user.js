const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment');
const UserSchema = new mongoose.Schema({
		uid: {
				type: Number
		},
		name: {
				type: String
		},
		age: {
				type: Number
		},
		job: {
				type: String
		},
		profile: {
				type: String
		},
		email: {
				type: String,
				required: true,
				trim: true,
				minlength: 1,
				unique: true,
				validate: {
						validator: validator.isEmail,
						message: '{VALUE} is not a valid email'
				}
		},
		icon: {
				type: String
		},
		password: {
				type: String,
				require: true,
				minlength: 6
		},
		provider: {
				type: String,
				enum: ['google', 'facebook', 'twitter', 'local']
		},
		collects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collect' }],
		createdAt: {
				type: Date,
				default: moment()
		}
});

let User = mongoose.model('User', UserSchema);
module.exports = {User};