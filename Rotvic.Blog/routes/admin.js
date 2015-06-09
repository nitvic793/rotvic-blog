var express = require('express');
var router = express.Router();
var db = require('../db/db.js');
var auth = require('../auth.js');
var messages = require('../sessionMessages.js');

router.get('/getPosts/:page', auth.onlyAdmin, function(req, res) {
    var pageNo = parseInt(req.params.page);
    var payload = { page: pageNo, next:false, prev:true };
    skip = (pageNo - 1) * 5;
    db.posts.GetAllPostCount(function (count) {
        if (count <= skip + 5) {
            payload.prev = false;
        }
        else {
            payload.prev = true;
        }
        if (pageNo != 1)
            payload.next = true;
        db.posts.GetPosts(5, skip, req.user._id, function (doc) {
            payload.posts = doc;
            res.render('partials/adminPosts', payload);
        });
    });
});

router.get('/', auth.onlyAdmin, function (req, res) {
    res.render('admin');
});

router.post('/changeContent', auth.onlyAdmin, function (req, res) {
    var data = req.body;
    console.log(req.body);
    db.admin.UpdateContent(data, function (doc) {
        req.session.message = messages.updateSuccess;
        res.redirect('/admin');
    });
});

module.exports = router;