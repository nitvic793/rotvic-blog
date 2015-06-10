var passport = require('passport');
var messages = require('./sessionMessages.js');

exports.requireAuth = function requireAuth(req, res, next) {
    // check if the user is logged in
    if (!req.isAuthenticated()) {
        req.session.messages = "You need to login to view this page";
        res.status(401).render('message', { subject: 'Unauthorized', body: 'Please login to perform this action.', title:"Error" });
    }
    else {
        next();
    }
}

exports.onlyAdmin = function onlyAdmin(req, res, next) {
    // check if the user is logged in and is admin
    if (!req.isAuthenticated() || req.user.role!=='admin') {
        req.session.messages = "You need to login to view this page";
        res.status(401).render('message', { subject: 'Unauthorized', body: 'Please login to perform this action.', title: "Error" });
    }
    else {
        next();
    }
}

exports.customAuthCallback = function customAuthCallback(req, res, next) {
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