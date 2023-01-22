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
const mongoose = require('mongoose');
const User = require('./models/user');
var jwt = require("jsonwebtoken");


mongoose.connect("mongodb+srv://tushar1:tushar1@cluster0.4zq2u.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const initializePassport = require("./passport-config");
initializePassport(
    passport
);


app.set('view-engine', 'ejs');
/*
Below 2 lines needed for express configuration with vercel
*/
app.set('views', __dirname + '/views')
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

app.post("/login", function (req, res) {
	if (!req.body.username) {
		res.json({ success: false, message: "Email was not given" })
	}
	else if (!req.body.password) {
		res.json({ success: false, message: "Password was not given" })
	}
	else {
		passport.authenticate("local", function (err, user, info) {
            console.log(err);
			if (err) {
				res.json({ success: false, message: err });
			}
			else {
                console.log(user);
                console.log(info);
				if (!user) {
					res.json({ success: false, message: "username or password incorrect" });
				}
				else {
					const token = jwt.sign({ email: user.email }, process.env.SESSION_SECRET, { expiresIn: "24h" });
					res.json({ success: true, message: "Authentication successful", token: token });
				}
			}
		}, {usernameField: 'email'})(req, res);
	}
});


app.get('/register', checkNotAuthenticated, ( req, res)=>{
    res.render('register.ejs');
});

app.post("/register", function (req, res) {
    User.register(new User({ userId: Date.now().toString(), email: req.body.email, name: req.body.name }), req.body.password, function (err, user) {
        if (err) {
            res.render('register.ejs', { message: "Your account could not be saved. Error: " + err });
            // res.json({ success: false, message: "Your account could not be saved. Error: " + err });
        }
        else {
            req.login(user, (er) => {
                if (er) {
                    res.render('register.ejs', { message: err });
                    // res.json({ success: false, message: er });
                }
                else {
                    res.redirect('/login');
                }
            });
        }
    });
});

app.delete('/logout', (req, res) => {
    req.logout(function(err) {
    if (err) { return next(err); }
        res.redirect('/login');
  });
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