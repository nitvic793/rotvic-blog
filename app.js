var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./db/db.js');

var config = require('./config.json');

var routes = require('./routes/index');
var users = require('./routes/users');
var blog = require('./routes/blog');
var admin = require('./routes/admin.js');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', swig.renderFile);

app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'khaleesi',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://' + config.mongodbUri);

//custom static paths. There maybe better ways to do this.
app.use('/blog', express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'public')));
app.use('/blog/post/', express.static(path.join(__dirname, 'public')));
app.use('/blog/post/edit', express.static(path.join(__dirname, 'public')));

/*Custom Middlewares*/

//Check if registration is enabled
app.use('/register', function (req, res, next) {
    if (config.enableRegistration) {
        next();
    }
    else {
        var payload = {
            subject: 'Unauthorized',
            body:'Registration has been disabled'
        };
        res.status(401).render('message',payload);
    }
});

//Set locals for side panel in blog
app.use('/blog', function (req, res, next) {
    db.posts.GetAllPosts(5, function (docs) {
        if (docs == null) {
            next();
        }
        else {
            res.locals.sidePosts = docs;
            next();
        }
    });
});

//Set locals for admin page
app.use('/admin', function (req, res, next) {
    db.admin.LoadContent(function (doc) {
        res.locals.content = doc;
        console.log(doc);
        next();
    });
});

// Set locals middleware
app.use(function (req, res, next) {
    res.locals.user = req.user;
    res.locals.title = config.title;
    res.locals.headerTitle = config.title;
    next();
});

// Reset message 
app.use(function (req, res, next) {
    if (req.session.message) {
        res.locals.message = req.session.message;
        req.session.message = null;
    }
    next();
});

// Routes
app.use('/', routes);
app.use('/users', users);
app.use('/blog', blog);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
