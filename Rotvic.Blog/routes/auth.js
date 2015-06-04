exports.requireAuth = function requireAuth(req, res, next) {
    // check if the user is logged in
    if (!req.isAuthenticated()) {
        req.session.messages = "You need to login to view this page";
        res.render('message', { subject: 'Unauthorized', body: 'Please login to perform this action.', title:"Error" });
    }
    else {
        next();
    }
}