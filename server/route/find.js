let express = require('express');
let router = express.Router();
let {Collect} = require('../models/collect');
const {checkAuthentication, gethash, encrypt, decrypt} = require('../controller/serverController');

router.get('/', checkAuthentication, async (req, res) => {
		const collects = await Collect.find().populate('user').sort( { _id: -1 });
		if(collects) {
				collects.forEach(collect => {
						if(collect.user._id.equals(req.user._id)) {
								collect.isSameUser = true;
						}else {
								collect.isSameUser = false;
						}
				});
		}

		//console.log(collects);
		res.render('feed.hbs', {
				title: 'feed',
				collects,
				user: req.user
		});
});

module.exports = router;