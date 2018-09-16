let express = require('express');
let router = express.Router();

router.get('/logout', (req, res) => {
		res.render('logout.hbs', {
				title: 'logout'
		});
});

module.exports = router;