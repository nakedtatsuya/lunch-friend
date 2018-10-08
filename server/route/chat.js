const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const {Message} = require('../models/message');
const {Collect} = require('../models/collect');
const {checkAuthentication, gethash, encrypt, decrypt} = require('../controller/serverController');


router.get('/:id', checkAuthentication, async (req, res) => {
		const you = await Collect.findById(req.params.id).populate('user');
		const firstId = parseInt(req.user._id.toString().slice(0, 14), 16);
		const secondId = parseInt(you.user._id.toString().slice(0, 14), 16);
		let roomId;
		//IDが若い方を先に足したルームIDを作る
		if(firstId < secondId) {
				roomId = req.user._id + req.params.id + you.user._id;
		}else {
				roomId = you.user._id + req.params.id + req.user._id;
		}
		const messages = await Message.find({roomId: roomId}).populate('user');
		res.render('chat.hbs', {
				title: "chat",
				me: req.user,
				you,
				messages,
				user: req.user
		});
});



module.exports = router;