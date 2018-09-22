require('./config/config');
require('../gulpfile');
let {mongoose} = require('./db/mongoose');
const _ = require('lodash');
const express = require('express');
const path = require('path');
let hbs = require('hbs');
let serverController = require('./controller/serverController');
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
const config = require('./config/config.json')
const port = process.env.PORT;
const partialsPath = path.join(__dirname, '../views/partials');
let server = http.createServer(app);
let io = socketIO(server);
//google認証設定
let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'hbs');
app.use(flash());

//静的フォルダの読み込みにはexpress.staticを使う
app.use(express.static('public'));
hbs.registerPartials(partialsPath);
hbs.registerHelper('getPostTime', function (timestamp) {
    const now = new Date().getTime();
    const created_at = timestamp.getTime();
    const lastTime = Math.ceil((now - created_at) / 1000 / 60);
    return new hbs.SafeString(
        lastTime
    );
});

// passport が ユーザー情報をシリアライズすると呼び出されます
passport.serializeUser(function (user, done) {
    done(null, user);
});

// passport が ユーザー情報をデシリアライズすると呼び出されます
passport.deserializeUser(function (obj, done) {
        done(null, obj);
});

// passport における具体的な認証処理を設定します。
passport.use(
    "local-login",
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
    }, function (req, email, password, done) {
        process.nextTick(() => {
            console.log(email, "email");
            User.findOne({email: email}, function (error, user) {
                const pass = serverController.gethash(password);
                console.log(user, "db_username")
                if (error) {
                    return done(error);
                }
                if (!user) {
                    console.log("missID");
                    return done(null, false, req.flash('err', 'ユーザーIDが正しくありません。'),req.flash('Flag_Signin',true));
                }
                if (user.password !== pass) {
                    console.log("password");
                    return done(null, false, req.flash('err', 'パスワードが正しくありません。'),req.flash('Flag_Signin',true));
                }
                return done(null, user);
            });
        });
    })
);

passport.use(new GoogleStrategy({
    clientID: config.googleAPI.clientID,
    clientSecret: config.googleAPI.clientSecret,
    callbackURL: config.googleAPI.callbackURL
}, function (req, refreshToken, profile, done) {
    // ここで profile を確認して結果を返す
    console.log(profile);
    console.log(profile.emails[0].value);
    User.findOne({email: profile.emails[0].value}, function (error, user) {
        if (error) {
            return done(error);
        }
        if (!user) {
            return done(null, false, req.flash('err','登録されていないgoogleアカウントです'),req.flash('Flag_Signin',true));
        }
        return done(null, user);
    });
}));

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


app.get('/', (req, res) => {
    //let test = await User.findOne({name: "tatsuya"});
    res.render('home',
        {
            title: 'HOME PAGE',
            user: 'test',
            err: req.flash('err')[0],
            Flag_Signin: req.flash('Flag_Signin')[0]
        });
});

app.post('/login', passport.authenticate(
    'local-login', {
        successRedirect: "/collect",
        failureRedirect: "/",
        failureFlash: true
    })
);

//google認証
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile','email'],
    failureFlash: true
}));

//google認証後callback先
app.get('/auth/google/callback',
    passport.authenticate('google', {
            failureRedirect: '/',  // 失敗したときの遷移先
            successRedirect: '/collect',  // 成功したときの遷移先
        },
    ));
//ログアウト
app.get('/logout', (req, res) => {
    res.render('logout.hbs', {
        title: 'logout'
    });
});

//会員登録
app.post('/signup', (req, res) => {
    const pass = serverController.gethash(req.body.password);
    //console.log(req.body.email);
    //const hash_mail = serverController.encrypt(req.body.email)
    //console.log(hash_mail)
    let user = new User({name:req.body.username,password:pass,email:req.body.email,age:req.body.age});
    user.save(function(err){
        if(err){
            console.log(err);
            res.render('home',{
                err: err,
                Flag_Signup: true
            });
        }
        else{
            res.render('home',{
                Flag_finish: true
            });
        }
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