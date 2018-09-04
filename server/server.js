require('./config/config');
require('../gulpfile');
const _ = require('lodash');
const express = require('express');
const path = require('path');
let hbs = require('hbs');
let {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
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

app.get('/find', (req, res) => {
		res.render('feed.hbs', {
				title: 'feed'
		});
});

server.listen(port, () => {
		console.log(`server start port ${port}`);
});