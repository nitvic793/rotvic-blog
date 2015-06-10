var express = require('express');
var router = express.Router();
var db = require('../db/db.js');
var auth = require('../auth.js');
var messages = require('../sessionMessages.js');

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
        if (doc == null) {
            res.status(404).render('error');
        }
        else if (doc.publishType === 'draft' && !req.isAuthenticated()) {
            req.session.message = messages.postNotReady;
            res.redirect('/blog/');
        }
        else {
            res.render("post", payload);
        }
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
    };
    db.posts.GetPublishedPostCount(function (count) {
        db.posts.GetAllPosts(3, function (doc) {
            payload.posts = doc;
            if (count <= 3) {
                payload.older = false;
            }
            else {
                payload.older = true;
            }
            payload.newer = false;
            payload.page = 1;
            res.render('blogIndex', payload);
        });
    }); 
});

router.get('/:page', function (req, res) {
    var payload = { };
    var pageNo = parseInt(req.params.page);
    var skip = 3 * (pageNo - 1);
    db.posts.GetPublishedPostCount(function(count){
        db.posts.GetAllPostsByPage(3, skip, function (doc) {
            payload.posts = doc;
            payload.page = pageNo;
            if (count <= skip + 3) {
                payload.older = false;
            }
            else {
                payload.older = true;
            }
            if (pageNo != 1) {
                payload.newer = true;
            }
            else {
                payload.newer = false;
            }
            res.render('blogIndex', payload);
        });
    });
});
router.get('/post/edit/:id', auth.requireAuth, function (req, res) {
    var payload = {};
    var id = parseInt(req.params.id);
    db.posts.GetPost(id, function (doc) {
        if (doc == null) {
            res.status(404).render('error');
        } 
        else {
            payload.post = doc;
            payload.title = "Edit Post";
            res.render("editPost", payload);
        }
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

router.get('/post/delete/:id', auth.requireAuth, function (req, res) {
    var id = parseInt(req.params.id);
    //TODO : Need to check if user deleting is the owner of the post
    db.posts.DeletePost(id, function (err) {
        if (!err) {
            req.session.message = messages.deletePostSuccess;
            res.send({ status: 'Success!' });
        }
        else {
            req.session.message = messages.deletePostSuccess;
            res.send({ status: 'Failed!' });
        }
    });
});
module.exports = router;