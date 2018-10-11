const config = require('./config.json');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const LocalStrategy = require("passport-local").Strategy;
const {User} = require('../models/user');
const {checkAuthentication, gethash, encrypt, decrypt} = require('../controller/serverController');

// passport が ユーザー情報をシリアライズすると呼び出されます
passport.serializeUser(function (user, done) {
		  done(null, user._id);
});

// passport が ユーザー情報をデシリアライズすると呼び出されます
passport.deserializeUser(function (id, done) {
		User.findById(id, function(err, user) {
				done(null, user);
		});
});
//ローカルログインとGoogleログインは停止中
// passport における具体的な認証処理を設定します。
// passport.use(
//     "local-login",
//     new LocalStrategy({
//         usernameField: "email",
//         passwordField: "password",
//         passReqToCallback: true
//     }, function (req, email, password, done) {
//         process.nextTick(() => {
//             User.findOne({email: email}, function (error, user) {
//                 const pass = gethash(password);
//                 console.log(user, "db_username");
//                 if (error) {
//                     return done(error);
//                 }
//                 if (!user) {
//                     console.log("missID");
//                     return done(null, false, req.flash('err', 'ユーザーIDが正しくありません。'),req.flash('Flag_Signin',true));
//                 }
//                 if (user.password !== pass) {
//                     console.log("password");
//                     return done(null, false, req.flash('err', 'パスワードが正しくありません。'),req.flash('Flag_Signin',true));
//                 }
//                 return done(null, user);
//             });
//         });
//     })
// );
//
//
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_API_ID,
    clientSecret: process.env.GOOGLE_API_SECRET,
    callbackURL: process.env.GOOGLE_API_CALLBACK,
    passReqToCallback : true
}, function (req,accessToken,refreshToken, profile, done) {
    User.findOne({email: profile.emails[0].value}, function (error, user) {
        if (error) {
            return done(error);
        }
        if (!user) {
										const pass = gethash(profile.id);
										const icon = profile.photos[0].value.replace('?sz=50', '?sz=240');
          let newUser = new User({
												uid: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            icon: icon,
            password: pass,
            provider: profile.provider
          });
										newUser.save().then(u => {
												return done(null, u);
          });
										return done(null, newUser);
        }
        return done(null, user);
    });
}));


passport.use(new FacebookStrategy({
				clientID: process.env.FACEBOOK_API_ID,
				clientSecret: process.env.FACEBOOK_API_SECRET,
				callbackURL: process.env.FACEBOOK_API_CALLBACK,
				passReqToCallback : true,
				profileFields: ['id', 'emails', 'name', 'photos', 'profileUrl', 'displayName']
		},
		function(req, accessToken, refreshToken, profile, done) {
				User.findOne({email: profile.emails[0].value}, function (error, user) {
						if (error) {
								return done(error);
						}
						if (!user) {
								const pass = gethash(profile.id);
								let newUser = new User({
										uid: profile.id,
										name: profile.displayName,
										email: profile.emails[0].value,
										icon: `http://graph.facebook.com/${profile.id}/picture?type=large`,
										password: pass,
										provider: profile.provider
								});
								newUser.save().then(u => {
										return done(null, u);
								});
								return done(null, newUser);
						}
						return done(null, user);
				});
		}
));


passport.use(new TwitterStrategy({
		consumerKey: process.env.TWITTER_CONSUMER_KEY,
		consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
		callbackURL: process.env.TWITTER_API_CALLBACK,
		includeEmail: true
}, function (req,accessToken,refreshToken, profile, done) {
		const icon = profile.photos[0].value.replace('_normal', '');
		User.findOne({email: profile.emails[0].value}, function (error, user) {
				if (error) {
						return done(error);
				}
				if (!user) {
						const pass = gethash(profile.id);
						let newUser = new User({
								uid: profile.id,
								name: profile.displayName,
								email: profile.emails[0].value,
								icon: icon,
								password: pass,
								provider: profile.provider
						});
						newUser.save().then(u => {
								return done(null, u);
						});
						return done(null, newUser);
				}
				return done(null, user);
		});
}));


module.exports = passport;
