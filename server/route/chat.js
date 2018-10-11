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
				user: req.user,
				isMyCollector: false
		});
});



router.get('/:collectId/:userId', checkAuthentication, async (req, res) => {
		const collect = await Collect.findById(req.params.collectId);
		const user = await User.findById(req.params.userId);
		if(!user) {
				res.redirect('/');
		}
		const firstId = parseInt(req.user._id.toString().slice(0, 14), 16);
		const secondId = parseInt(user._id.toString().slice(0, 14), 16);
		//IDが若い方を先に足したルームIDを作る
		if(firstId < secondId) {
				roomId = req.user._id + req.params.collectId + user._id;
		}else {
				roomId = user._id + req.params.collectId + req.user._id;
		}
		const messages = await Message.find({roomId: roomId}).populate('user');
		res.render('chat.hbs', {
				title: "chat",
				me: req.user,
				messages,
				you: collect,
				toUserId: req.params.userId,
				isMyCollector: true
		});
});




module.exports = router;