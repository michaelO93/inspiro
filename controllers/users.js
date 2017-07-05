
var User = require('../models/person');
var passport = require('passport');

var env = {

};

module.exports = {

    logout:function (req,res) {
        req.logout();
        delete req.user;
        res.redirect('/');
    },

    register:function (req,res,next) {
        req.assert('email', 'Email is not valid').isEmail();
        req.assert('fullname', 'first Name cannot be blank').notEmpty();
        req.assert('password', 'Password must be at least 4 characters long').len(4);
        req.sanitize('email').normalizeEmail({remove_dots: false});

        var errors = req.validationErrors();

        if (errors){
            var messages = [];
            errors.forEach(function (error) {
                messages.push(error.msg)
            });
            req.flash('error',messages);
        }

        User.findOne({email:req.body.email},function (err,existingUser) {
            if (err) return next(err);
            if (existingUser){
                return ('Account wit '+existingUser.email+ 'already exists');
            }else{
                var fullname = req.body.fullname;
                var nameSplit  = fullname.split('');
                var firstName =  nameSplit[0];
                var lastName = nameSplit[1];
                var newUser =  {
                    firstName: firstName,
                    lastName:lastName
                };

                var user = new User();
                user.email = req.body.email;
                user.password = req.body.password;
                user.profile = newUser;

                user.save(function (err) {
                    if (err){
                        return next(err);
                    }
                    req.logIn(user,function (err) {
                        if(err){
                            res.json(500,err.message);
                        }
                    });
                    return res.redirect('/user-dashboard')
                })
            }
        })



    }
};