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