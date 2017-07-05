var express = require('express');
var router = express.Router();
var controllers = require('../controllers/users.js');
var passport = require('passport');
var ensured = require('passport-auth0');
var Person = require('../models/person');

/* GET home page. */
var env = {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CALLBACK_URL: 'http://localhost:3000/callback'
};
router.get('/', function (req, res, next) {

    return res.render('index', {env: env})
});

router.get('/login', function (req, res, next) {
    res.render('login', {env: env})
});

// router.post('/register',function (req,res,next) {
//     console.log(req.body);
//    next();
// },controllers.register);

// router.use(function (req,res,next) {
//     if(req.isAuthenticated()) return next();
//     res.redirect('/');
// });


router.get('/user/new_story', function (req, res, next) {

    Person.findOne({"provider": req.user.provider}).then(function (user) {
        if (user) {
            userObject = user
        } else {
            userObject = req.user;
        }
    });
    res.render('users/new_story',{user: userObject || req.user});
});

router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
});
// console.log(req.user);
var userObject = '';
router.get('/user/profile', function (req, res, next) {
    console.log(req.user,  54);
    Person.findOne({"provider": req.user.provider}).then(function (user) {
        if (user) {
            userObject = user
        } else {
            userObject = req.user;
        }
    });
    res.render('users/profile', {user: userObject || req.user});
});

router.post('/upload', function (req, res) {
    console.log(req)
});


router.get('/user/home', function (req, res, next) {
    Person.findOne({"provider": req.user.provider}).then(function (user) {
        if (user) {
            userObject = user
        } else {
            userObject = req.user;
        }
    });
    res.render('users/home', {env: env, user: userObject || req.user});
});


router.get('/callback', passport.authenticate('auth0', {failureRedirect: '/'}),
    function (req, res) {
        res.redirect(req.session.returnTo || '/user/profile');
    });

module.exports = router;
