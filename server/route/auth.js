let express = require('express');
let router = express.Router();
let passport = require('../config/passport');
router.get('/google', passport.authenticate('google', {
		scope: [
				'https://www.googleapis.com/auth/user.addresses.read',
				'email',
				'https://www.googleapis.com/auth/user.phonenumbers.read',
				'https://www.googleapis.com/auth/userinfo.profile',
				'https://www.googleapis.com/auth/user.birthday.read'
		]
}));
router.get('/facebook', passport.authenticate('facebook', {
		scope: ['email', 'public_profile']
}));

router.get('/twitter', passport.authenticate('twitter'));

//google認証後callback先
router.get('/google/callback',
		passport.authenticate('google', {
						failureRedirect: '/',  // 失敗したときの遷移先
						successRedirect: '/',  // 成功したときの遷移先
						failureFlash: true
				},
		));

//facebook認証後callback先
router.get('/facebook/callback',
		passport.authenticate('facebook', {
						failureRedirect: '/',  // 失敗したときの遷移先
						successRedirect: '/',  // 成功したときの遷移先
						failureFlash: true
				},
		));

//twitter認証後callback先
router.get('/twitter/callback',
		passport.authenticate('twitter', {
						failureRedirect: '/',  // 失敗したときの遷移先
						successRedirect: '/',  // 成功したときの遷移先
						failureFlash: true
				},
		));


module.exports = router;