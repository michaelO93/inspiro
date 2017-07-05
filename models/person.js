var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email: {type: String,required:true},
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    firstName: String,
    lastName: String,
    gender: String,
    provider: String,
    website: String,
    picture: String,
    address: String,
    user_id: String,
    city: String,
    state: String,
    bankcode: String,
    bankaccountnumber: String
    ,
    notifyEmail: Boolean,
    notifySms: Boolean
}, {timestamps: true});

// password hash middleware

userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        })
    })
});

// validating users password

userSchema.methods.comparePassword = function (userPassword, cb) {
    bcrypt.compare(userPassword, this.password, function (err, isMatch) {
        cb(err, isMatch);
    })
};

userSchema.methods.isPasswordValid = function (userPassword) {
    return bcrypt.compareSync(userPassword, this.password);
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size) {
    size = size || 200;
    var url = 'https://gravatar.com/avatar/?s=${size}&d=retro';
    if (!this.email) {

        return url;
    }
    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/${md5}?s=${size}&d=retro';
};

var Person = mongoose.model('Person', userSchema);

module.exports = Person;