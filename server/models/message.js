const mongoose = require('mongoose');
const moment = require('moment');
const now = moment();

const MessageSchema = new mongoose.Schema({
		user: {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'User'
		},
		toUser: {
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'User'
		},
		roomId: {
				type: String,
				required: true
		},
		message: {
				type: String,
				required: true
		},
		createdAt: {
				type: Date,
				default: now
		}
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = {Message};