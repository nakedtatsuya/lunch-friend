require('./config/config');
require('../gulpfile');
let {mongoose} = require('./db/mongoose');
const _ = require('lodash');
const express = require('express');
const path = require('path');
let hbs = require('hbs');
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let flash = require("connect-flash");
let session = require("express-session");
const {Collect} = require('./models/collect');
let User = require('./models/user');
const http = require('http');
let passport = require('passport')
let LocalStrategy = require("passport-local").Strategy;
const socketIO = require('socket.io');
let app = express();
const port = process.env.PORT;
const partialsPath = path.join(__dirname, '../views/partials');
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'hbs');
app.use(flash());

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

// passport が ユーザー情報をシリアライズすると呼び出されます
passport.serializeUser(function (id, done) {
    done(null, id);
});

// passport が ユーザー情報をデシリアライズすると呼び出されます
passport.deserializeUser(function (id, done) {
    User.findById(id, (error, user) => {
        if (error) {
            return done(error);
        }
        done(null, user);
    });
});

// passport における具体的な認証処理を設定します。
passport.use(
    "local-login",
    new LocalStrategy({
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
    }, function (req, username, password, done) {
        process.nextTick(() => {
        	console.log(username,"username");

            User.findOne({ name: username}, function (error, user) {
            	console.log(user,"db_username")

                if (error) {
                    return done(error);
                }
                if (!user) {
                    return done(null, false, { message: 'ユーザーIDが正しくありません。' });
                }
                if (user.password !== password) {
                    return done(null, false, {message: 'パスワードが正しくありません。'});
                }
                return done(null, user);
            });
        });
    })
);

// ログインされているか判別
function checkAuthentication(req,res,next){
    	if(req.isAuthenticated()){
        	//req.isAuthenticated() will return true if user is logged in
        	next();
    	} else{
        	res.redirect("/login");
    	}
}

// passport設定
app.use(session({ secret: "some salt", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
		//let test = await User.findOne({name: "tatsuya"});
		res.render('home.hbs', {
				title: 'HOME PAGE',
				user: 'test'
		});
});

//ログイン
app.get('/login', (req,res) => {
		res.render('login.hbs',{
			title: 'login',
			message: req.flash('error')
		});
});

app.post('/login',passport.authenticate(
    'local-login', {
        successRedirect: "/collect",
        failureRedirect: "/login",
        failureFlash : true
    })
);

//ログアウト
app.get('/logout',(req,res) => {
    res.render('logout.hbs',{
        title: 'logout'
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
		await collect.save().then(colect => {

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