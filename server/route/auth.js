let express = require('express');
let router = express.Router();
let passport = require('../config/passport');
router.get('/google', passport.authenticate('google', {
		scope: ['profile','email']
}));

//google認証後callback先
router.get('/google/callback',
		passport.authenticate('google', {
						failureRedirect: '/',  // 失敗したときの遷移先
						successRedirect: '/collect',  // 成功したときの遷移先
						failureFlash: true
				},
		));


module.exports = router;