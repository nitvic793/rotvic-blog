var mongojs = require('mongojs');
var db = mongojs('rblog', ['posts','counters']);
var utility = require('./../utility.js');
var Post = require('../../models/post.js');

function getNextSequence(name,callback) {
    db.counters.findAndModify(
        {
            query: { _id: name },
            update : { $inc : { seq: 1 } },
            upsert: true,
            new: true
        },
        function (err, ret) {
            if (!err)
                callback(ret.seq);
            else
                callback(null);
        }
    );    
}

exports.GetPost = function (id, callback) {
    //note : use findOne() function and update dependent functions
    Post.findOne({ 'id': id }, function (err, doc) {
        if (!err) {
            callback(doc);
        }
        else {
            callback(null);
        }
    });
}

exports.InsertPost = function (doc, callback) {
    getNextSequence('id', function (seq){
        if (seq == null) {
            throw new Error("Null Sequence ID");
        }
        doc.id = seq;
        Post.create(doc, function (err, doc) {
            if (err) {
                callback(false);
            }
            else {
                callback(true);
            }
        });
    });    
}

exports.GetAllPosts = function (limit, callback) {
    Post.find({}).limit(limit).sort({ date: -1 }).exec(function (err, doc) {
        if (!err) {
            callback(doc);
        }
        else {
            callback(null);
        }
    });
}

exports.GetPosts = function (limit, skip, callback) {
    Post.find({}).limit(limit).skip(skip).sort({ date: -1 }).exec(function (err, doc) {
        if (!err) {
            callback(doc);
        }
        else {
            callback(null);
        }
    });
}


exports.UpdatePost = function (doc, callback) {
    exports.GetPost(doc.id, function (old) {
        if (old != null) {
            doc.date = old.date;
            doc.modified = new Date();
            Post.update({ 'id': doc.id }, doc, function (err) {
                if (!err) {
                    callback(doc);
                }
                else {
                    callback(null);
                }
            });
        }
    });    
}

exports.CheckUserOfPost = function (userId, postId, callback) {
    exports.GetPost(postId, function (doc) {
        if (userId.id === doc.userId.id) {
            callback(true);
        }
        else {
            callback(false);
        }
    });
}

exports.DeletePost = function (id, callback) {
    Post.remove({ 'id': id }, function (err) {
        if (err) {
            throw err;
        }
    });
}

