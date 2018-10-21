let express = require('express');
let router = express.Router();
let {validate, constraints} = require('../config/validate');
const _ = require('lodash');
const {checkAuthentication, gethash, encrypt, decrypt} = require('../controller/serverController');
const {Collect} = require('../models/collect');

router.get('/', checkAuthentication, (req, res) => {
		res.render('form/collect.hbs', {
				title: 'collect',
				loginUser: req.user
		});
});

router.post('/', checkAuthentication, async (req, res) => {
		const body = _.pick(req.body, ['user', 'station', 'store', 'link', 'num', 'time', 'minute', 'comment']);
		let collect = new Collect(body);
		await collect.save().then(collect => {
				res.redirect(302, "/find");
		}).catch(e => {
				var err = validate(body, constraints);
				if(err.station)	req.flash('station', err.station);
				if(err.store)	req.flash('store', err.store);
				if(err.link)	req.flash('link', err.link);
				if(err.num)	req.flash('num', err.num);
				if(err.time) req.flash('time', err.time);
				if(err.minute)	req.flash('minute', err.minute);
				if(err.comment)	req.flash('comment', err.comment);

				res.render('form/collect.hbs', {
						station: req.flash("station"),
						store: req.flash("store"),
						link: req.flash("link"),
						num: req.flash("num"),
						time: req.flash("time"),
						minute: req.flash("minute"),
						comment: req.flash("comment"),
						stationValue: body.station,
						storeValue: body.store,
						linkValue: body.link,
						numValue: body.num,
						timeValue: body.ticollectme,
						minuteValue: body.minute,
						commentValue: body.comment,
						validClass: "was-validated",
						user: req.user
				});
		});
});

module.exports = router;