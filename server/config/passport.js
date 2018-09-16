const config = require('./config.json');
let passport = require('passport');
let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
let LocalStrategy = require("passport-local").Strategy;
let User = require('../models/user');

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
				usernameField: "username",
				passwordField: "password",
				passReqToCallback: true
		}, function (req, username, password, done) {
				process.nextTick(() => {
						console.log(username, "username");

						User.findOne({name: username}, function (error, user) {
								const pass = serverController.gethash(password);
								console.log(user, "db_username")

								if (error) {
										return done(error);
								}
								if (!user) {
										return done(null, false, {message: 'ユーザーIDが正しくありません。'});
								}
								if (user.password !== pass) {
										return done(null, false, {message: 'パスワードが正しくありません。'});
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
}, function (accessToken, refreshToken, profile, done) {
		// ここで profile を確認して結果を返す
		console.log(profile);
		console.log(profile.emails[0].value);
		User.findOne({email: profile.emails[0].value}, function (error, user) {
				if (error) {
						return done(error);
				}
				if (!user) {
						return done(null, false, {message: '登録されていないgoogleアカウントです'});
				}
				return done(null, user);
		});
}));

module.exports = passport;
