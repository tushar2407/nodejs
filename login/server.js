if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt"); 
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override"); // for logout

const initializePassport = require("./passport-config");
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);


const users = [];

app.set('view-engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.use(express.urlencoded({extended:  false})); // need the form values in req variable
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave : false, // do not save session variables again if nothing changed
    saveUninitialized: false  // do not empty value in a session if no value entered 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.name});
});

app.get('/login', checkNotAuthenticated, (req, res)=>{
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, ( req, res)=>{
    res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPass
        });
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
    console.log(users);
    // req.body.name 
});

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect("login");
})

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}

app.listen(3000);

module.exports = app;