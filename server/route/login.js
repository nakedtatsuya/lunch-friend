let express = require('express');
let router = express.Router();
let passport = require('passport');
//ログイン
router.get('/', (req, res) => {
		res.render('login.hbs', {
				title: 'login',
				message: req.flash('error')
		});
});

router.post('/', passport.authenticate(
		'local-login', {
				successRedirect: "/collect",
				failureRedirect: "/login",
				failureFlash: true
		})
);

module.exports = router;