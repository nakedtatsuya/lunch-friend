require('./config/config');
require('../gulpfile');
const home = require('./route/home');
const collect = require('./route/collect');
const find = require('./route/find');
const login = require('./route/login');
const logout = require('./route/logout');
const auth = require('./route/auth');
let {mongoose} = require('./db/mongoose');
const express = require('express');
const path = require('path');
let hbs = require('./config/hbs');
let serverController = require('./controller/serverController');
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

// ログインされているか判別
function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else {
        res.redirect("/login");
    }
}

// passport設定
app.use(session({secret: "some salt", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', home);
//ログイン
app.use('/login', login);
//ログアウト
app.use('/logout', logout);
//google認証
app.use('/auth', auth);
//募集アクション
app.use('/collect', collect);
//募集一覧ページ
app.use('/find', find);

server.listen(port, () => {
    console.log(`server start port ${port}`);
});