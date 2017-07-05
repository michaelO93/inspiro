/**
 * Created by michael-prime on 4/25/17.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/person');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user)
    })
});

passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done) {
        req.assert('email', 'Invalid Email').notEmpty().isEmail();
        req.assert('password', 'Invalid Password, Password must be atleast 4').notEmpty().isLength({min: 4});
        var errors = req.validationErrors();
        if (errors) {
            var messages = [];
            errors.forEach(function (error) {
                messages.push(error.msg);
            });
            return done(null, false, {message:messages});
        }

        console.log('here');

        User.findOne({'email': email.toLowerCase()}, function (err, user) {
            if (err) return done(err);
            if (!user) return done(null, false, {message: 'No record was found for ' + email});
            if (!user.isPasswordValid(password)) return done(null, false, {message: 'Wrong Password'});
            return done(null, user);
        })
    }));