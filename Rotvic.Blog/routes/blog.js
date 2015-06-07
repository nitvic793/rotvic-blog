var express = require('express');
var router = express.Router();
var db = require('../db/db.js');
var auth = require('../auth.js');

/* GET post with specified ID */
router.get('/post/:id', function (req, res) {
    var payload = {
        user: req.user
    };
    var id = parseInt(req.params.id);
    if (isNaN(id))
        throw new Error("Bad argument");
    db.posts.GetPost(id, function (doc) {
        payload.post = doc;
        payload.title = "Blog";
        res.render("post", payload);
    });
});

router.get('/post/', auth.requireAuth, function (req, res) {
    var payload = {
        title: 'New Post'
    };
    res.render('newPost', payload);
});

router.post('/post/addnew', auth.requireAuth, function (req, res) {
    var doc = req.body;
    doc.date = new Date();
    doc.userId = req.user._id;
    doc.name = req.user.username;
    db.posts.InsertPost(doc, function (done) {        
        if (done) {
            console.log(doc);
            var id = doc.id;
            res.redirect('/blog/post/' + id);
        }
        else {
            res.render('error', { stack: 'Error in DB ' + err });
        }
    });
});

router.get('/', function (req, res) {
    var payload = {
        title:'Blog'
    };
    db.posts.GetAllPosts(3, function (doc) {
        payload.posts = doc;
        res.render('blogIndex', payload);
    });   
});

router.get('/post/edit/:id', auth.requireAuth, function (req, res) {
    var payload = {};
    var id = parseInt(req.params.id);
    db.posts.GetPost(id, function (doc) {
        payload.post = doc;
        payload.title = "Blog";
        res.render("editPost", payload);
    });
});

router.post('/post/update/:id', auth.requireAuth, function (req, res) {
    var doc = req.body;
    doc.userId = req.user._id;
    var id = parseInt(req.params.id);
    db.posts.CheckUserOfPost(doc.userId, id, function (isOwner) {
        if (isOwner) {
            doc.id = id;
            db.posts.UpdatePost(doc, function (doc) {
                if (doc) {
                    res.redirect('/blog/post/' + doc.id);
                }
            });
        }
        else {
            res.render('message', { subject: "Error", body: "You are not allowed to update" });
        }
    });
});

module.exports = router;