let express = require('express');
let router = express.Router();
let passport = require('passport');

router.get('/', (req, res) => {
		res.render('home',{
				title: 'HOME PAGE',
				user: 'test',
				err: req.flash('err')[0],
				Flag_Signin: req.flash('Flag_Signin')[0],
		});
});


module.exports = router;