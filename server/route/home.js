const express = require('express');
const router = express.Router();
const passport = require('passport');
const serverController = require('../controller/serverController');
const {User} = require('../models/user');
router.get('/', (req, res) => {
		res.render('home',{
				title: 'HOME PAGE',
				user: req.user,
				err: req.flash('err')[0],
            	Flag_Signin: req.flash('Flag_Signin')[0],
		});
});

//ログイン
router.post('/login', passport.authenticate(
    'local-login', {
        successRedirect: "/collect",
        failureRedirect: "/",
        failureFlash: true
    })
);

router.post('/signup', (req, res) => {
    const pass = serverController.gethash(req.body.password);

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

module.exports = router;