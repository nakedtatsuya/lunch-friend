require('./config/config');
require('../gulpfile');
const _ = require('lodash');
const express = require('express');
const path = require('path');
let hbs = require('hbs');
let {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Collect} = require('./models/collect');
const http = require('http');
const socketIO = require('socket.io');
let app = express();
const port = process.env.PORT;
const partialsPath = path.join(__dirname, '../views/partials');
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'hbs');
//静的フォルダの読み込みにはexpress.staticを使う
app.use(express.static('public'));
hbs.registerPartials(partialsPath);
hbs.registerHelper('getPostTime', function(timestamp) {
		const now = new Date().getTime();
		const created_at = timestamp.getTime();
		const lastTime = Math.ceil((now - created_at) / 1000 / 60);
		return new hbs.SafeString(
				lastTime
		);
});

app.get('/', (req, res) => {
		//let test = await User.findOne({name: "tatsuya"});
		res.render('home.hbs', {
				title: 'HOME PAGE',
				user: 'test'
		});
});

app.get('/collect', (req, res) => {
		res.render('form/collect.hbs', {
				title: 'collect'
		});
});

app.post('/collect', async (req, res) => {
		const body = _.pick(req.body, ['station', 'store', 'link', 'num', 'time', 'minute', 'comment']);
		let collect = new Collect(body);
		await collect.save().then(cllect => {

		}).catch(e => {
				
		});
		res.redirect(302, "/find");
});

app.get('/find', async (req, res) => {
		let collects = await Collect.find();
		res.render('feed.hbs', {
				title: 'feed',
				collects
		});
});


server.listen(port, () => {
		console.log(`server start port ${port}`);
});