var express = require('express');
var router = express.Router();
var db = require('../db/db.js');

/* GET post with specified ID */
router.get('/post/:id', function (req, res) {
    var payload = {};
    var id = parseInt(req.params.id);
    db.posts.GetPost(id, function (doc) {
        payload.post = doc[0];
        payload.post.date = doc[0].date.toLocaleDateString();
        payload.title = "Blog";
        res.render("post", payload);
    });
});

router.get('/post/', function (req, res) {
    var payload = {
        title:'New Post'
    };
    res.render('newPost',payload);
});

router.post('/post/addnew', function (req, res) {
    var doc = req.body;
    doc.date = new Date();
    doc.userId = 1;
    db.users.getUserName(doc.userId, function (name) {
        if (name == null) {
            throw 'Name cannot be null';
        }
        db.posts.InsertPost(doc, function (done) {
            doc.name = name;
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
});

router.get('/', function (req, res) {
    var payload = {
        title:'Blog'
    };
    db.posts.GetAllPosts(3, function (doc) {
        for (var i=0;i<doc.length;++i){
            doc[i].date = doc[i].date.toLocaleDateString();
        }
        payload.posts = doc;
        res.render('blogIndex', payload);
    });   
});

router.get('/post/edit/:id', function (req, res) {
    var payload = {};
    var id = parseInt(req.params.id);
    db.posts.GetPost(id, function (doc) {
        payload.post = doc[0];
        payload.title = "Blog";
        res.render("editPost", payload);
    });
});

router.post('/post/update/:id', function (req, res) {
    var doc = req.body;
    doc.userId = 1;
    var id = parseInt(req.params.id);
    db.users.getUserName(doc.userId, function (name) {
        if (name == null) {
            throw 'Name cannot be null';
        }
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
});

module.exports = router;