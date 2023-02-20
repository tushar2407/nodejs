if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
  
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []
const books = [
    {
        name: "Prince of Persia"
    }
]
const liked_books= []
const readLater_books = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
secret: process.env.SESSION_SECRET,
resave: false,
saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/books', async (req, res) =>  {
    // const books = await Book.find({}).exec();
    var name = "" ;
    if(req.isAuthenticated())
    {
        name=req.user.name;
    }
    console.log(books);
    res.render('books.ejs', {name: name, books: books});
});

app.post('/books-like', checkAuthenticated, async (req, res) => {
    // const book = await LikedBook.create({ 
    //     email: req.user.email,
    //     book: req.body.book
    // });
    // book.save();
    liked_books.push({
        email: req.user.email,
        book: req.body.book
    });

    res.redirect("/books" );
});

app.get('/books-liked', checkAuthenticated, async (req, res) => {
    const temp = liked_books.filter(book => book.email === req.user.email);
    console.log(temp);
    res.render("books_liked.ejs", {name: req.user.name, books: temp});
});

app.post('/books-readlater', checkAuthenticated, async (req, res) => {
    readLater_books.push({
        email: req.user.email,
        book: req.body.book
    });
    res.redirect("/books" );
});

app.get('/books-to-readlater', checkAuthenticated, async (req, res) => {
    const temp = readLater_books.filter(book => book.email === req.user.email);
    console.log(temp);
    res.render("books_readlater.ejs", {name: req.user.name, books: temp});
});
  
app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name, user: req.user })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        console.log(req.body);
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            role: ((req.body.role==='admin') ? 'admin':'user'),
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

app.delete('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
    res.redirect('/login');
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(3000)