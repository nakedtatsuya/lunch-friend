const mongoose = require('mongoose');

let CollectSchema = new mongoose.Schema({
		station: {
				type: String,
				required: true
		},
		store: {
				type: String,
				required: true
		},
link: {
				type: String
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
				default: Date.now()
		}
});

const Collect = mongoose.model('Collect', CollectSchema);

module.exports = {Collect};