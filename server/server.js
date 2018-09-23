require('./config/config');
require('../gulpfile');
let {mongoose} = require('./db/mongoose');
const {generateMessage} = require('./config/helper');
const home = require('./route/home');
const collect = require('./route/collect');
const find = require('./route/find');
const login = require('./route/login');
const logout = require('./route/logout');
const auth = require('./route/auth');
const signup = require('./route/signup');
const express = require('express');
const path = require('path');
let hbs = require('./config/hbs');
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let flash = require("connect-flash");
let session = require("express-session");
let User = require('./models/user');
const http = require('http');
let passport = require('./config/passport');
const socketIO = require('socket.io');
let app = express();
const port = process.env.PORT;
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'hbs');
app.use(flash());
//静的フォルダの読み込みにはexpress.staticを使う
app.use(express.static('public'));

// passport設定
app.use(session({secret: "some salt", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', home);
//ログイン
app.use('/login', login);
//登録
app.use('/signup', signup);
//ログアウト
app.use('/logout', logout);
//google認証
app.use('/auth', auth);
//募集アクション
app.use('/collect', collect);
//募集一覧ページ
app.use('/find', find);

app.get('/chat/:user_id', (req, res) => {
    res.render('chat.hbs', {
        title: "chat"
    });
});

io.on('connection', (socket) => {
		console.log('connected!!');
		socket.on('disconnect', () => {
				console.log('server disconnected!!');
		});

		socket.on("createMessage", (message) => {
				console.log(message);
				io.emit("newMessage", generateMessage(message.from, message.text));
		});
});

server.listen(port, () => {
    console.log(`server start port ${port}`);
});