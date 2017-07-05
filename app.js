var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var passport = require('passport');
var validator = require('express-validator');
var flash = require('express-flash');
var mongoose = require('mongoose');
var expressStatusMonitor = require('express-status-monitor');
var MongoStore = require('connect-mongo/es5')(session);
var chalk = require('chalk');
var dotenv = require('dotenv');
var formidable = require('formidable');
var fs = require('fs');
var Auth0Strategy = require('passport-auth0');
var Person = require('./models/person');

dotenv.load({path: '.env'});

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', function () {
    console.log('%s MongoDB connection established!', chalk.green('✓'));
});
mongoose.connection.on('error', function () {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});

// require('./config/passport');


var strategy = new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/callback'
}, function (accessToken, refreshToken, extraParams, profile, done) {
    var user = {};
    console.log(profile);
    // if (profile.provider === 'facebook' || profile.provider === 'google-oauth2') {
        user.firstName = profile.name.givenName;
        user.lastName = profile.name.familyName;
        user.picture = profile.picture;
        user.provider = profile.provider;
        user.gender = profile.gender;
        user.email = profile.emails[0].value;
        user.user_id = profile.identities[0].user_id;
    // }

    Person.find().then(function (record) {
        for (var x in record) {
            if (record.hasOwnProperty(x)) {
                if (record && record[x].user_id === user.user_id) {
                    return record[0].user_id;
                }
                else {
                    var person = new Person(user);
                    person.save(function (err) {
                        if (err) throw new Error(err);
                        console.log('user saved successfully.')
                    });
                }
            }
        }
    });

    return done(null, profile);
});


passport.use(strategy);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(validator());
app.use(expressStatusMonitor());
app.use(flash());
app.use(session({
    secret: 'mnmbjbjbkj098hjboyuu899077898-mkk',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 180 * 60 * 1000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});


app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
