const express = require('express');
var {ObjectID} = require('mongodb');
const router = express.Router();
const {User} = require('../models/user');
const {Message} = require('../models/message');
const {Collect} = require('../models/collect');
const {checkAuthentication, gethash, encrypt, decrypt} = require('../controller/serverController');

router.get('/:id', checkAuthentication, async (req, res) => {
		const collectId = new ObjectID.ObjectID(req.params.id);
		const applyUsers = await Message.aggregate([
				{
						$match: {
								$and: [
										{"toUser": req.user._id},
										{"collect": collectId}
								]
						}
				},
				{
						$group: {
								_id: "$user"
						}
				},
				{
						$lookup: {
								from: 'users',
						  localField: '_id',
				    foreignField: '_id',
				    as: 'profile'
						}
     }
		]);
		let users = [];
		let isUser;
		if(applyUsers.length > 0) {
				for(var i = 0; i < applyUsers.length; i++) {
						applyUsers[i].profile[0].hostId = req.user._id;
						applyUsers[i].profile[0].collectId = req.params.id;
						users.push(applyUsers[i].profile[0]);
				}
				isUser = true;
		}else {
				isUser = false;
		}

		res.render('apply.hbs', {
				users,
				isUser,
				me: req.user
		});
});

module.exports = router;