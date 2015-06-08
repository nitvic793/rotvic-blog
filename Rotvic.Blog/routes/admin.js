var express = require('express');
var router = express.Router();
var db = require('../db/db.js');
var auth = require('../auth.js');
//// To do

router.get('/getPosts', auth.onlyAdmin, function(req, res) {
    var payload = {};
    db.posts.GetPosts(5, 0, req.user._id, function (doc) {
        payload.posts = doc;
        res.render('partials/adminPosts', payload);
    });
});

router.get('/', auth.onlyAdmin, function (req, res) {
    res.render('admin');
});

module.exports = router;