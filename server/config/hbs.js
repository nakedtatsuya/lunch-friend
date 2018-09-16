let hbs = require('hbs');
const path = require('path');
const partialsPath = path.join(__dirname, '../../views/partials');

hbs.registerPartials(partialsPath);
hbs.registerHelper('getPostTime', function (timestamp) {
		const now = new Date().getTime();
		const created_at = timestamp.getTime();
		const lastTime = Math.ceil((now - created_at) / 1000 / 60);
		return new hbs.SafeString(
				lastTime
		);
});

module.exports = hbs;