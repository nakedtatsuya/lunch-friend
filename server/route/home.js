let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
		res.render('home.hbs',{
				title: 'HOME PAGE',
				user: 'test'
		});
});

module.exports = router;