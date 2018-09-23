const mongoose = require('mongoose');
const validator = require('validator');

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
		i_con: {
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
		collects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collect' }]
});

let User = mongoose.model('User', UserSchema,'User');
module.exports = User;