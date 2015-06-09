var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var messages = require('../sessionMessages.js');
var db = require('../db/db.js');

function customAuthCallback(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.session.message = messages.loginFailure;
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            req.session.message = messages.loginSuccess;
            return next();
        });
    })(req, res, next);
}

router.get('/', function (req, res) {
    db.admin.LoadContent(function (doc) {
        var payload = { content: doc };
        res.render('index', payload);
    });
});

router.get('/register', function (req, res) {
    res.render('register', {});
});

router.post('/register', function (req, res) {
    Account.register(new Account({ username : req.body.username, role: req.body.role }), req.body.password, function (err, account) {
        if (err) {
            return res.render('register', { account : account });
        }
        
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function (req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', customAuthCallback, function (req, res) {
    res.redirect('/');
});

router.get('/logout', function (req, res) {
    req.logout();
    req.session.message = messages.logoutSuccess;
    res.redirect('/');
});

router.get('/ping', function (req, res) {
    res.status(200).send("pong!");
});


module.exports = router;