const express = require('express');
let hbs = require('hbs');
const {User} = require('./models/user');
const http = require('http');
const socketIO = require('socket.io');
let app = express();
const port = process.env.PORT || 3000;

let server = http.createServer(app);
let io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'hbs');
//静的フォルダの読み込みにはexpress.staticを使う
app.use(express.static('public'));
hbs.registerPartials(__dirname + '../views/partials');



var newUser = new User({
		name: "tatsuya",
		age: 22
});

newUser.save().then(doc => {
		console.log('saved');
});




app.get('/', async (req, res) => {
		let test = await User.findOne({name: "tatsuya"});
		res.render('home.hbs', {
				title: 'HOME PAGE',
				user: test.name
		});
});

app.get('/about', (req, res) => {
		res.render('about.hbs', {
				title: 'about'
		});
});

app.get('/feed/:location', (req, res) => {
		res.render('feed.hbs', {
				title: req.params.location
		});
});

app.post('/feed', (req, res) => {
		res.redirect(`/feed/${req.body.location}`);
});




server.listen(port, () => {
		console.log(`server start port ${__dirname}`);
});