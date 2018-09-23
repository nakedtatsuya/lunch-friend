let express = require('express');
let router = express.Router();
let {Collect} = require('../models/collect');
const {checkAuthentication, gethash, encrypt, decrypt} = require('../controller/serverController');

router.get('/', checkAuthentication, async (req, res) => {
		let collects = await Collect.find().populate('user').sort( { created_at: -1 });
		console.log(collects);
		res.render('feed.hbs', {
				title: 'feed',
				collects,
		});
});

module.exports = router;