const mongoose = require('mongoose');
let moment = require('moment');
const now = moment();

let CollectSchema = new mongoose.Schema({
		_user_id: {
				type: mongoose.Schema.Types.ObjectId,
				required: false
		},
		station: {
				type: String,
				required: true
		},
		store: {
				type: String,
				required: true
		},
link: {
				type: String,
		  required: true
		},
		num: {
				type: Number,
				required: true
		},
		time: {
				type: String,
				required: true
		},
		minute: {
				type: String,
				required: true
		},
		comment: {
				type: String,
				required: true
		},
		created_at: {
				type: Date,
				default: now
		}
});

const Collect = mongoose.model('Collect', CollectSchema);

module.exports = {Collect};