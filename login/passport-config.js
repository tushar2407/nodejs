const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/user');

function initialize(passport){
    
    passport.use(new LocalStrategy(User.authenticate(), {usernameField: 'email'}));

    // passport.serializeUser((user, done) => done(null, user.id));
    passport.serializeUser(User.serializeUser());
    // passport.deserializeUser((id, done) => {done(null, getUserById(id)) });
    passport.deserializeUser(User.deserializeUser());
}

module.exports = initialize;