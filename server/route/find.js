let express = require('express');
let router = express.Router();
let {Collect} = require('../models/collect');
router.get('/', async (req, res) => {
		let collects = await Collect.find().sort( { created_at: -1 } );
		res.render('feed.hbs', {
				title: 'feed',
				collects
		});
});

module.exports = router;