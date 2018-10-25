const express = require('express');
const router = express.Router();
const {ObjectID} = require('mongodb');
const {checkAuthentication} = require('../controller/serverController');
const {User} = require('../models/user');
const {Message} = require('../models/message');

router.get('/:id', async (req, res) => {
		const profileId = new ObjectID.ObjectID(req.params.id);
		const user = await User.findById(profileId);


		res.render('user.hbs', {
				loginUser: req.user,
				user
		});
		});



module.exports = router;