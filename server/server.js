require('./config/config');
const env = process.env.NODE_ENV || 'development';
if(env === 'development' || env === 'test'){
		require('../gulpfile');
		require('dotenv').config();
}

require('./db/mongoose');
//route
const home = require('./route/home');
const collect = require('./route/collect');
const find = require('./route/find');
const chat = require('./route/chat');
const auth = require('./route/auth');
const apply = require('./route/apply');
const express = require('express');
const {io, app, server} = require('./config/socket');
const path = require('path');
const hbs = require('./config/hbs');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require('./config/passport');
const port = process.env.PORT;


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
//google認証
app.use('/auth', auth);
//chat
app.use('/chat', chat);
//募集アクション
app.use('/collect', collect);
//募集一覧ページ
app.use('/find', find);
//応募一覧ページ
app.use('/apply', apply);


server.listen(port, () => {
    console.log(`server start port ${port}`);
		console.log(process.env);
});